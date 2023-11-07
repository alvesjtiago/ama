export default async function AMA({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const castResponse = await fetch(
    'https://api.neynar.com/v2/farcaster/cast?type=url&identifier=' +
      searchParams['url'],
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        api_key: process.env.NEYNAR_API_KEY ?? '',
      },
    },
  )

  const castObject = await castResponse.json()

  const amaUserName = castObject.cast.mentioned_profiles?.[0]?.display_name

  const threadResponse = await fetch(
    'https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=' +
      castObject.cast.hash,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        api_key: process.env.NEYNAR_API_KEY ?? '',
      },
    },
  )

  const thread = await threadResponse.json()

  let items: { q: string; a: string }[] = []

  thread.result.casts.map((cast: any) => {
    if (cast.parentHash == castObject.cast.hash) {
      // Find answer
      const replies = thread.result.casts.filter((obj: any) => {
        return obj.parentHash === cast.hash
      })
      const reply = replies?.[0]

      items.push({
        q: cast.text,
        a: reply?.text,
      })
    }
  })

  return (
    <main className="container mx-auto my-6 px-4">
      <h3>{amaUserName}</h3>
      <ul>
        {items.map((i) => (
          <li className="mt-4" key={i.q}>
            <div>Q: {i.q}</div>
            <div>A: {i.a}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
