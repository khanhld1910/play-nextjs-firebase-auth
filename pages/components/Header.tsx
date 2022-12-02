import React from 'react'
import Link from 'next/link'

const Header = () => (
  <header className="w-full py-4 bg-gray-700 text-white">
    <nav className="container mx-auto inline-flex justify-end items-center gap-4">
      <ul className="inline-flex gap-4 items-center">
        <Link href="/" passHref>
          <li className="underline hover:text-blue-400">Public Page</li>
        </Link>
        <Link href="/protected" passHref>
          <li className="underline hover:text-blue-400">Protected Page</li>
        </Link>
        <Link href="/login" passHref>
          <li className="underline hover:text-blue-400">Login Page</li>
        </Link>
        <Link href="/me" passHref>
          <li className="underline hover:text-blue-400">Profile Page</li>
        </Link>
      </ul>
    </nav>
  </header>
)

export default Header
