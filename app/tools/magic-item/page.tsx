import dynamic from 'next/dynamic'
import React from 'react'

const MagicItemClient = dynamic(() => import('./index'), { ssr: false })

export default function Page(){
  return (
    <div className="container mx-auto p-6">
      <div className="mt-4">
        <MagicItemClient />
      </div>
    </div>
  )
}
