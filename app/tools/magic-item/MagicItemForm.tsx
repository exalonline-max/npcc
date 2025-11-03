"use client"

import React from 'react'
import generateItems, { LocalItem } from './generateLocal'
import Button from '../../../components/ui/button'

const WEAPON_TYPES = ['Sword','Axe','Dagger','Mace','Bow','Crossbow','Spear','Staff','Warhammer','Greatsword'] as const
const WEAPON_ICONS: Record<string,string> = { Sword:'🗡️', Axe:'🪓', Dagger:'🗡️', Mace:'🔨', Bow:'🏹', Crossbow:'🏹', Spear:'🔱', Staff:'✨', Warhammer:'⚒️', Greatsword:'⚔️' }
const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shield'] as const
const ARMOR_ICONS: Record<string,string> = { 'Light Armor':'🧥', 'Medium Armor':'🥋', 'Heavy Armor':'🪖', 'Shield':'🛡️' }

function CircleGrid({ title, options, value, onChange }:{
  title: string,
  options: { value:string, label:string, icon?:string }[],
  value: string,
  onChange: (v:string)=>void,
}){
  return (
    <div className="mb-3">
      <div className="label"><span className="label-text font-semibold">{title}</span></div>
      <div className="grid grid-cols-4 gap-3">
        {options.map(opt=>{
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={()=>onChange(opt.value)}
              className={`flex flex-col items-center gap-2 ${selected ? 'text-primary' : 'opacity-80 hover:opacity-100'}`}
            >
              <div className={`btn btn-circle ${selected ? 'btn-primary' : ''}`}>{opt.icon ?? opt.label[0]}</div>
              <span className="text-xs text-center leading-tight">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MagicItemClient(){
  const [category, setCategory] = React.useState<'weapon'|'armor'|'trinket'|'scroll'>('weapon')
  // use simple string state here to avoid strict union mismatch when wired from other components
  const [weaponType, setWeaponType] = React.useState<string>('Sword')
  const [armorType, setArmorType] = React.useState<string>('Light Armor')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // ... other state and logic

  return (
    <div className="p-4">
      {/* ... other UI elements */}

      {category==='weapon' && (
        <CircleGrid
          title="Weapon Type"
          options={WEAPON_TYPES.map(w=>({ value:w, label:w, icon: WEAPON_ICONS[w] }))}
          value={weaponType}
          onChange={(v)=>setWeaponType(v)}
        />
      )}

      {category==='armor' && (
        <CircleGrid
          title="Armor Type"
          options={ARMOR_TYPES.map(a=>({ value:a, label:a, icon: ARMOR_ICONS[a] }))}
          value={armorType}
          onChange={(v)=>setArmorType(v)}
        />
      )}

      {/* ... rest of the component */}

      {copiedId && (
        <div className="toast toast-end">
          <div className="alert alert-success"><span>Copied to clipboard.</span></div>
        </div>
      )}
    </div>
  )
}
