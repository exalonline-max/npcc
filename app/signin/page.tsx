import AuthForm from '../../components/AuthForm'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const user = await currentUser()
  if (user) redirect('/tools')

  return (
    <main style={{ padding: 24 }}>
      <AuthForm />
    </main>
  )
}
