import React from 'react'
import Link from 'next/link'

const Header = () => (
  <header className="w-full py-4 bg-green-700 text-white">
    <nav className="container mx-auto inline-flex justify-end items-center gap-4">
      <ul className="inline-flex gap-4 items-center">
        <Link href="/" passHref>
          <li>
            <a>Public Page</a>
          </li>
        </Link>
        <Link href="/protected" passHref>
          <li>
            <a>Protected Page</a>
          </li>
        </Link>
        <Link href="/me" passHref>
          <li>
            <a>Me</a>
          </li>
        </Link>
      </ul>
    </nav>
  </header>
)

export default Header
