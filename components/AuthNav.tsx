"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'

export default function AuthNav() {
  const [hasClerkClient, setHasClerkClient] = useState(false)

  useEffect(() => {
    // feature-detect Clerk client script
    setHasClerkClient(typeof window !== 'undefined' && !!(window as any).Clerk)
  }, [])

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link href="/" className="btn-ghost" style={{ fontWeight: 600 }}>
        Home
      </Link>
      <Link href="/tools/wild-magic" className="btn-ghost" style={{ fontWeight: 600 }}>
        Wild Magic
      </Link>
      <Link href="/tools/magic-item" className="btn-ghost" style={{ fontWeight: 600 }}>
        Magic Item
      </Link>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        {hasClerkClient ? (
          <SignInButton mode="modal">
            <button type="button" className="btn btn-primary">Sign in</button>
          </SignInButton>
        ) : (
          <Link href="/signin" className="btn btn-primary">Sign in</Link>
        )}
      </SignedOut>
    </div>
  )
}

