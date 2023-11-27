const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    api_key: process.env.NEYNAR_API_KEY ?? '',
  },
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
    <code>
      {items.map((item) => (
        <span key={item.hash}>
          **{item.question}**
          <br />
          {item.answer}
          <br />
          <br />
        </span>
      ))}
    </code>
  )
}
