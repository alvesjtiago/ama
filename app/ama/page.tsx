import { Metadata, ResolvingMetadata } from 'next'
import Linkify from 'linkify-react'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    api_key: process.env.NEYNAR_API_KEY ?? '',
  },
  next: { revalidate: 600 },
}

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const page = searchParams['page'] ?? 0
  const pageNumber = +page
  const nextPageNumber = pageNumber + 1

  // // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

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
    likes: number
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
          likes: cast?.reactions?.count,
        })
      }
    }
  })

  const orderedThreads = items.sort((a, b) => b.likes - a.likes)
  const hash = orderedThreads[pageNumber].hash

  return {
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': process.env.BASE_URL + '/api/cast/' + hash,
      'fc:frame:button:1': 'Answer',
      'fc:frame:button:2': 'Next',
      'fc:frame:post_url':
        process.env.BASE_URL +
        '/api/frame?url=' +
        searchParams['url'] +
        '&page=' +
        pageNumber,
    },
    openGraph: {
      title: 'AMA',
      images: process.env.BASE_URL + '/api/cast/' + mainCast.cast.hash,
    },
  }
}

export default async function AMA({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined }
}>) {
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
                <a
                  href={`https://warpcast.com/${item.userUsername}/${item.hash}`}
                  target="_blank"
                >
                  <div className="text-md font-bold text-ellipsis overflow-hidden whitespace-pre-line">
                    {item.question}
                  </div>
                </a>
                <div className="text-sm mt-2 text-ellipsis overflow-hidden whitespace-pre-line">
                  <Linkify options={{ className: 'underline' }}>
                    {item.answer}
                  </Linkify>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
