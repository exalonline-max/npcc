import '../styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import AuthNav from '../components/AuthNav'

export const metadata = {
  title: 'NPCC D&D Tools',
  description: 'Minimal prototype'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={publishableKey}>
          <header style={{display: 'flex', justifyContent: 'space-between', padding: 12}}>
            <div>NPCC</div>
            <AuthNav />
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
