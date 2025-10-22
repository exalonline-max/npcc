import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(){
  try{
    const user = await currentUser()
    if (!user) return NextResponse.json({ signedIn: false })
    return NextResponse.json({ signedIn: true, id: user.id, email: user.emailAddresses?.[0]?.emailAddress || null })
  } catch (err:any){
    return NextResponse.json({ signedIn: false, error: err?.message || String(err) })
  }
}
