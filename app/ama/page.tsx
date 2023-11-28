import Linkify from 'linkify-react'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    api_key: process.env.NEYNAR_API_KEY ?? '',
  },
  next: { revalidate: 600 },
}

export default async function AMA({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const mainCastResponse = await fetch(
    'https://api.neynar.com/v2/farcaster/cast?type=url&identifier=' +
      searchParams['url'],
    options,
  )
  const mainCast = await mainCastResponse.json()

  // AMA user
  const amaUser = mainCast.cast.mentioned_profiles?.[0] || mainCast.cast.author
  const amaUsername = amaUser?.username
  const amaDisplayName = amaUser?.display_name

  const threadResponse = await fetch(
    'https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=' +
      mainCast.cast.hash,
    options,
  )
  const thread = await threadResponse.json()

  let items: {
    hash: string
    question: string
    answer: string
    userAvatar: string
    userUsername: string
  }[] = []

  thread.result.casts.map((cast: any) => {
    if (cast.parentHash == mainCast.cast.hash) {
      // Find answer
      const replies = thread.result.casts.filter((obj: any) => {
        return (
          obj.parentHash === cast.hash &&
          obj.author.username === amaUser?.username
        )
      })
      const reply = replies?.[0]

      // Only include items with answers from the AMA user
      if (reply) {
        items.push({
          hash: cast.hash,
          question: cast.text,
          answer: reply?.text,
          userAvatar: cast?.author?.pfp?.url,
          userUsername: cast?.author?.username,
        })
      }
    }
  })

  return (
    <>
      <div className="text-xl">
        <a href="/">AMA</a> with{' '}
        <a href={`https://warpcast.com/${amaUsername}`} target="_blank">
          {amaDisplayName}
        </a>
      </div>
      <div className="text-sm mt-2">{mainCast.cast.text}</div>
      <ul className="mt-18">
        {items.map((item) => (
          <li className="mt-12 border-l pl-2 py-2" key={item.question}>
            <div className="flex items-top">
              <a
                className="inline-block h-5 w-5 shrink-0 mr-2"
                href={`https://warpcast.com/${item.userUsername}`}
                target="_blank"
              >
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                  src={item.userAvatar}
                  alt=""
                />
              </a>{' '}
              <div className="w-full ">
                <Linkify options={{ className: 'underline' }}>
                  <a
                    href={`https://warpcast.com/${item.userUsername}/${item.hash}`}
                    target="_blank"
                  >
                    <div className="text-md font-bold text-ellipsis overflow-hidden whitespace-pre-line">
                      {item.question}
                    </div>
                  </a>
                  <div className="text-sm mt-2 text-ellipsis overflow-hidden whitespace-pre-line">
                    {item.answer}
                  </div>
                </Linkify>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
