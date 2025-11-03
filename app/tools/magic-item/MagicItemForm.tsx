"use client"

import React from 'react'
import generateItems, { LocalItem } from './generateLocal'
import Button from '../../../components/ui/button'

type Props = {
  onPick: (item: LocalItem)=>void
}

export default function MagicItemForm({ onPick }: Props){
  const [recipient, setRecipient] = React.useState('')
  const [slot, setSlot] = React.useState<'weapon'|'armor'|'trinket'>('weapon')
  const [level, setLevel] = React.useState<number>(3)
  const [theme, setTheme] = React.useState<string>('Martial')
  const [tone, setTone] = React.useState<string>('Practical')
  const [hook, setHook] = React.useState('')
  const [options, setOptions] = React.useState<LocalItem[] | null>(null)

  function onGenerate(){
    const input = { recipient: recipient || undefined, slot, level, theme, tone, hook: hook || undefined }
    const items = generateItems(input, 3)
    setOptions(items)
  }

  return (
    <div className="p-4 bg-white rounded-md border">
      <h3 className="font-semibold mb-2">Quick Generator</h3>
      <div className="grid gap-2">
        <input className="border rounded px-2 py-1" placeholder="Recipient (optional)" value={recipient} onChange={(e)=>setRecipient(e.target.value)} />
        <div className="flex gap-2">
          <label className={`px-2 py-1 rounded ${slot==='weapon' ? 'bg-amber-200' : 'bg-gray-100'}`}><input type="radio" checked={slot==='weapon'} onChange={()=>setSlot('weapon')} /> Weapon</label>
          <label className={`px-2 py-1 rounded ${slot==='armor' ? 'bg-amber-200' : 'bg-gray-100'}`}><input type="radio" checked={slot==='armor'} onChange={()=>setSlot('armor')} /> Armor</label>
          <label className={`px-2 py-1 rounded ${slot==='trinket' ? 'bg-amber-200' : 'bg-gray-100'}`}><input type="radio" checked={slot==='trinket'} onChange={()=>setSlot('trinket')} /> Trinket</label>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Level</label>
          <input type="number" min={1} max={20} value={level} onChange={(e)=>setLevel(Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
          <select value={theme} onChange={(e)=>setTheme(e.target.value)} className="ml-auto border rounded px-2 py-1">
            <option>Martial</option>
            <option>Arcane</option>
            <option>Divine</option>
            <option>Shadow</option>
            <option>Fey</option>
            <option>Elemental</option>
            <option>Technomancy</option>
          </select>
        </div>

        <select value={tone} onChange={(e)=>setTone(e.target.value)} className="border rounded px-2 py-1">
          <option>Practical</option>
          <option>Legendary</option>
          <option>Weird</option>
          <option>Cursed</option>
        </select>

        <input className="border rounded px-2 py-1" placeholder="Special hook (optional)" value={hook} onChange={(e)=>setHook(e.target.value)} />

        <div className="flex justify-end">
          <Button variant="primary" onClick={onGenerate}>Generate 3 Items</Button>
        </div>

        {options && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map(opt => (
              <div key={opt.id} className="border rounded p-3 bg-gray-50">
                <div className="text-sm text-gray-600">{opt.rarity} {opt.slot}</div>
                <div className="font-bold text-lg mt-1">{opt.name}</div>
                <div className="text-xs italic text-gray-700 mt-1">{opt.flavor}</div>
                <div className="mt-2 text-sm">{opt.description}</div>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {opt.affixes.map((a,i)=>(<li key={i}>{a}</li>))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={()=>onPick(opt)}>Pick</Button>
                  <Button variant="ghost" onClick={()=>navigator.clipboard?.writeText(`${opt.name}\n${opt.description}\n- ${opt.affixes.join('\n- ')}`)}>Copy</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
