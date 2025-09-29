import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CharacterForm from '../../components/CharacterForm'

export default async function ToolsPage() {
  const user = await currentUser()
  if (!user) redirect('/')

  return (
    <main style={{ padding: 24 }}>
      <h2>Tools</h2>
      <CharacterForm />
    </main>
  )
}
