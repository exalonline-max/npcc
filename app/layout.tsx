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
          <header style={{borderBottom: '1px solid var(--border)'}}>
            <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8}}>
              <div style={{fontWeight: 700}}>NPCC</div>
              <AuthNav />
            </div>
          </header>
          <div className="container">{children}</div>
        </ClerkProvider>
      </body>
    </html>
  )
}
