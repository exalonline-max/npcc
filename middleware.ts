import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
  publicRoutes: ['/', '/api/(.*)']
})

export const config = {
  matcher: ['/', '/api/:path*', '/tools', '/tools/:path*']
}
