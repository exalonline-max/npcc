"use client"

import React, { useState } from 'react'
import Button from '../../../components/ui/button'

export default function WildMagicClient(){
  const [result, setResult] = useState<string | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const [effects, setEffects] = useState<any[] | null>(null)

  async function loadEffects(){
    if (effects) return effects
    const res = await fetch('/api/wild-magic/effects')
    const data = await res.json()
    setEffects(data.effects)
    return data.effects
  }

  async function roll(){
    const list = await loadEffects()
    if (!list || list.length === 0) return
    const i = Math.floor(Math.random() * list.length)
    setIndex(list[i].id)
    setResult(list[i].text)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button variant="primary" onClick={roll}>Roll for Wild Magic</Button>
        <Button variant="secondary" onClick={() => { setResult(null); setIndex(null) }}>Clear</Button>
      </div>

      <div className="p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold">Result</h3>
        {result ? (
          <div>
            <div className="text-sm text-gray-500">Effect #{index}</div>
            <div className="mt-2">{result}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">No result yet. Click the button to roll.</div>
        )}
      </div>

      <div>
        <h4 className="text-md font-medium">Full Table</h4>
        <div className="mt-2 space-y-2 max-h-72 overflow-auto p-2 border rounded bg-white">
          {effects ? (
            effects.map((e:any) => (
              <div key={e.id}><strong>#{e.id}:</strong> {e.text}</div>
            ))
          ) : (
            <div className="text-sm text-gray-600">Table will appear after first load.</div>
          )}
        </div>
      </div>
    </div>
  )
}
