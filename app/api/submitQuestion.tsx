import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.NEYNAR_API_KEY ?? '', // Corrected the header key to be a string
        },
        body: JSON.stringify(req.body),
      })

      if (!response.ok)
        throw new Error(`API call failed with status ${response.status}`)

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error submitting question:', error)

      // Check if error is an instance of Error and access its message property
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
      } else {
        // If the error is not an instance of Error, send a generic error message
        res.status(500).json({ error: 'An unexpected error occurred' })
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
