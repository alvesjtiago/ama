'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Warpcast URL
      </label>
      <div className="relative mt-2 rounded-md shadow-sm max-w-md">
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="ex. https://warpcast.com/dwr.eth/0x87e91802"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <a className="p-2 px-4 rounded border text-sm" href={`/ama?url=${url}`}>
          Publish AMA
        </a>
      </div>

      <div className="mt-12 text-xs">
        Examples:
        <ul className="text-slate-500 text-xs">
          <li className="mt-1">
            <a href="/ama?url=https://warpcast.com/dwr.eth/0x390ae86a">
              https://warpcast.com/dwr.eth/0x390ae86a
            </a>
          </li>
          <li className="mt-1">
            <a href="/ama?url=https://warpcast.com/dwr.eth/0x7735946a">
              https://warpcast.com/dwr.eth/0x7735946a
            </a>
          </li>
          <li className="mt-1">
            <a href="/ama?url=https://warpcast.com/dwr.eth/0x87e91802">
              https://warpcast.com/dwr.eth/0x87e91802
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
