import dynamic from 'next/dynamic'
import React from 'react'

const MagicItemClient = dynamic(() => import('./MagicItemClient'), { ssr: false })

export default function Page(){
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">Magic Item Generator</h1>
      <p className="text-sm text-gray-600">Generate Diablo‑2 inspired magic items with options for type, rarity, theme, and a "make it weird" toggle.</p>
      <div className="mt-4">
        <MagicItemClient />
      </div>
    </div>
  )
}
