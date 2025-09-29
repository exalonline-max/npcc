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
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        {hasClerkClient ? (
          <SignInButton mode="modal">
            <button type="button" className="btn">Sign in</button>
          </SignInButton>
        ) : (
          <Link href="/signin" className="btn">Sign in</Link>
        )}
      </SignedOut>
    </div>
  )
}

