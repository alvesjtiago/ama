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
        Warpcast AMA URL
      </label>
      <div className="relative mt-2 rounded-md shadow-sm max-w-md">
        <input
          type="text"
          name="price"
          id="price"
          className={`
            block w-full rounded-md py-1.5 px-3
            ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
            focus:outline-0 focus:ring-1 focus:ring-slate-500
            sm:text-sm sm:leading-6
          `}
          placeholder="ex. https://warpcast.com/dwr.eth/0x87e91802"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <a
          className="p-2 px-4 rounded border hover:border-slate-500 text-sm"
          href={`/ama?url=${url}`}
        >
          Publish AMA
        </a>
      </div>

      <div className="mt-12 text-xs">
        Upcoming:
        <ul className="text-slate-500 text-xs">
          <li className="mt-1">garrytan (4th January - 10am PT)</li>
          <li className="mt-1">cdixon.eth (31st January - 10am PT)</li>
        </ul>
      </div>

      <div className="mt-12 text-xs">
        Past:
        <ul className="text-slate-500 text-xs">
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0xd39ac80f"
              target="_blank"
            >
              elad
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/yb/0x7d5219e5"
              target="_blank"
            >
              horsefacts.eth
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0x08541631"
              target="_blank"
            >
              toly
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0x029f7cce"
              target="_blank"
            >
              balajis.eth
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0x390ae86a"
              target="_blank"
            >
              vitalik.eth
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0x7735946a"
              target="_blank"
            >
              barmstrong
            </a>
          </li>
          <li className="mt-1">
            <a
              href="/ama?url=https://warpcast.com/dwr.eth/0x87e91802"
              target="_blank"
            >
              fredwilson.eth
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
