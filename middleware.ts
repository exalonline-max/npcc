import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: ['/', '/api/:path*', '/tools', '/tools/:path*']
}
