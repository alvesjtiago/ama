import { NextRequest, NextResponse } from 'next/server'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    api_key: process.env.NEYNAR_API_KEY ?? '',
  },
  next: { revalidate: 600 },
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const index = body.untrustedData.buttonIndex

  console.log(request.url)
  const url = new URL(request.url)
  const page = url.searchParams.get('page') ?? 0
  const pageNumber = +page

  // Decide if next or the same
  let nextPageNumber = pageNumber + 1
  if (index == 1) {
    nextPageNumber = pageNumber
  }

  const mainCastResponse = await fetch(
    'https://api.neynar.com/v2/farcaster/cast?type=url&identifier=' +
      url.searchParams.get('url'),
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
    replyHash: string
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
          obj.parentHash === cast.hash && obj.author.fname === amaUser?.username
        )
      })
      const reply = replies?.[0]

      // Only include items with answers from the AMA user
      if (reply) {
        items.push({
          hash: cast.hash,
          replyHash: reply?.hash,
          question: cast.text,
          answer: reply?.text,
          userAvatar: cast?.author?.avatar_url,
          userUsername: cast?.author?.fname,
          likes: cast?.reactions?.count,
        })
      }
    }
  })

  const orderedThreads = items.sort((a, b) => b.likes - a.likes)

  let hash = orderedThreads[nextPageNumber].hash
  if (index == 1) {
    hash = orderedThreads[nextPageNumber].replyHash
  }

  return new NextResponse(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>AMA</title>
                <meta name="fc:frame" content="vNext">
                <meta name="fc:frame:image" content="${`${process.env.BASE_URL}/api/cast/${hash}`}">
                <meta name="fc:frame:post_url" content="${
                  process.env.BASE_URL +
                  '/api/frame?url=' +
                  url.searchParams.get('url') +
                  '&page=' +
                  nextPageNumber
                }">
                <meta property="fc:frame:button:1" content="Answer"/>
                <meta property="fc:frame:button:2" content="Next"/>
              </head>
              <body>
              </body>
            </html>
          `)
}
