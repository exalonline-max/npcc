import dynamic from 'next/dynamic'
import React from 'react'

const WildMagicClient = dynamic(() => import('./WildMagicClient'), { ssr: false })

export default function Page(){
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">Wild Magic Table</h1>
      <p className="text-sm text-gray-600">Roll for Wild Magic effects and browse the full table.</p>
      <div className="mt-4">
        <WildMagicClient />
      </div>
    </div>
  )
}
