import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>NPCC D&D Tools</h1>
      <SignedIn>
        <p>
          You are signed in. Go to <Link href="/tools">tools</Link>
        </p>
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
        <SignInButton />
      </SignedOut>
    </main>
  )
}
