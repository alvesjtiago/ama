import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    api_key: process.env.NEYNAR_API_KEY ?? '',
  },
}

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } },
) {
  const castResponse = await fetch(
    'https://api.neynar.com/v2/farcaster/cast?type=hash&identifier=' +
      params.hash,
    options,
  )
  const cast = await castResponse.json()

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {cast.cast.text}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
