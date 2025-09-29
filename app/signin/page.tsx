import AuthForm from '../../components/AuthForm'

export default function SignInPage({ searchParams }: { searchParams?: { mode?: string } }) {
  return (
    <main style={{padding: 24}}>
      <AuthForm />
    </main>
  )
}
