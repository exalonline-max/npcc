"use client"

import React from 'react'
import Button from '../../../components/ui/button'
import IconPicker from '../../../components/IconPicker'

const WEAPON_TYPES = ['Sword','Axe','Bow','Staff','Wand']
const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shield']
const THEMES = ['Martial','Arcane','Nature','Necrotic','Infernal']
const RARITIES = ['Common','Uncommon','Rare','Legendary']

function rand<T>(arr:T[]){ return arr[Math.floor(Math.random()*arr.length)] }
function roll(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }

export default function MagicItemClient(){
  // keep all state here in the parent
  const [category, setCategory] = React.useState<string>('weapon')
  const [weaponType, setWeaponType] = React.useState<string>(WEAPON_TYPES[0])
  const [armorType, setArmorType] = React.useState<string>(ARMOR_TYPES[0])
  const [rarity, setRarity] = React.useState<string>('Common')
  const [theme, setTheme] = React.useState<string>('Martial')
  const [weird, setWeird] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<any| null>(null)
  const [effects, setEffects] = React.useState<any[] | null>(null)
  const [copied, setCopied] = React.useState<boolean>(false)

  React.useEffect(()=>{
    // load wild-magic effects for "weird" add-ons
    fetch('/api/wild-magic/effects').then(r=>r.json()).then(d=>{ if (d?.effects) setEffects(d.effects) }).catch(()=>{})
  },[])

  function makeName(thing:string){
    const prefixes = ['Burning','Frozen','Vicious','Hallowed','Stormforged','Gloom','Radiant','Wicked','Luminous','Dire','Ebon']
    const suffixes = ['Slaying','Fortune','the Bear','the Phoenix','Vitality','Shadows','the Voyager','Precision','Whispers','the Infinite']
    const people = ['Gunnar','Elara','Mord','Syl','Thistle','Grimm']
    const pattern = Math.random()
    if (pattern < 0.6) return `${rand(prefixes)} ${thing} of ${rand(suffixes)}`
    if (pattern < 0.9) return `${people[Math.floor(Math.random()*people.length)]}'s ${thing} of ${rand(suffixes)}`
    return `${rand(prefixes)} ${thing}`
  }

  function generateStats(thing:string){
    const base:any = { name: makeName(thing), rarity, theme, description: '', affixes: [] }
    // base stat pools inspired by Diablo-style affixes
    if (category === 'weapon'){
      const dmg = {
        Common: `${roll(3,6)}-${roll(6,12)}`,
        Uncommon: `${roll(6,10)}-${roll(10,16)}`,
        Rare: `${roll(10,16)}-${roll(16,28)}`,
        Legendary: `${roll(18,30)}-${roll(30,60)}`,
      }[rarity]
      base.description = `${thing} — damage ${dmg}`
      if (theme === 'Martial') base.affixes.push(`+${roll(1,3)} to Attack`) 
      if (theme === 'Arcane') base.affixes.push(`Adds +${roll(1,3)} to spell strike`) 
      if (theme === 'Nature') base.affixes.push(`Entwined — small chance to root on hit (flavor)`) 
      if (theme === 'Necrotic') base.affixes.push(`Draining — heals the wielder for small amount (flavor)`) 
      if (theme === 'Infernal') base.affixes.push(`Burning touch — minor fire flair`) 
      if (rarity === 'Uncommon') base.affixes.push(`${roll(1,6)}% chance to pierce`) 
      if (rarity === 'Rare') base.affixes.push(`+${roll(1,6)} to all attacks`) 
      if (rarity === 'Legendary') base.affixes.push(`Grants one unique active ability (DM adjudicates)`) 
    } else if (category === 'armor'){
      const acMap = {
        'Light Armor': {Common: 11, Uncommon:12, Rare:13, Legendary:14},
        'Medium Armor': {Common:12, Uncommon:13, Rare:14, Legendary:15},
        'Heavy Armor': {Common:14, Uncommon:15, Rare:16, Legendary:18},
        'Shield': {Common:2, Uncommon:3, Rare:4, Legendary:5}
      }[armorType] || { Common: 10, Uncommon:11, Rare:12, Legendary:13 }
      const acVal = (acMap as any)[rarity] ?? acMap.Common
      base.description = `${armorType} — base protection ${acVal}`
      if (theme === 'Martial') base.affixes.push(`+${roll(1,3)} to Strength (flavor)`) 
      if (theme === 'Arcane') base.affixes.push(`Ward — small magic resistance (flavor)`) 
      if (theme === 'Nature') base.affixes.push(`Camouflage — subtle concealment (flavor)`) 
      if (theme === 'Necrotic') base.affixes.push(`Thorns — hurts attackers slightly (flavor)`) 
      if (theme === 'Infernal') base.affixes.push(`Hellforged — warmth and menace`) 
      if (rarity === 'Rare') base.affixes.push(`+${roll(1,2)} to saving throws`) 
      if (rarity === 'Legendary') base.affixes.push(`Reduces damage from one source by half once per short rest`) 
    } else {
      // other trinkets / rings / amulets
      base.description = `Trinket — minor boon`
      base.affixes.push(`+${roll(1,4)} to a skill of your choice`)
      if (rarity === 'Rare') base.affixes.push(`+${roll(1,4)} to all skills`) 
      if (rarity === 'Legendary') base.affixes.push(`Unique effect: reshapes small fate`) 
    }

    // small rarity flavor
    if (rarity === 'Uncommon') base.affixes.push('Has a subtle glow')
    if (rarity === 'Rare') base.affixes.push('Has an unusual rune carved into it')
    if (rarity === 'Legendary') base.affixes.push('Legendary — storied in song')

    // weight the number of affixes by rarity
    return base
  }

  function attachWeird(base:any){
    if (!effects || effects.length === 0) return base
    // pick 1-2 weird effects, small chance for more
    const count = Math.random() < 0.6 ? 1 : 2
    const picks = []
    for (let i=0;i<count;i++){
      const e = effects[Math.floor(Math.random()*effects.length)]
      picks.push(`#${e.id}: ${e.text}`)
    }
    base.affixes.push(`Weird: ${picks.join(' / ')}`)
    return base
  }

  function onGenerate(){
    let thing = 'Trinket'
    if (category === 'weapon') thing = weaponType
    if (category === 'armor') thing = armorType
    const base = generateStats(thing)
    if (weird) attachWeird(base)
    setResult(base)
  }

  async function copyResultText(){
    if (!result) return
    const text = `${result.name}\n${result.description}\n\nAffixes:\n- ${result.affixes.join('\n- ')}`
    try{
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(()=>setCopied(false),2000)
    }catch(e){
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try{ document.execCommand('copy'); setCopied(true); setTimeout(()=>setCopied(false),2000) }catch(e){ alert('Copy failed') }
      document.body.removeChild(ta)
    }
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <IconPicker
            name="category"
            options={[
              { value: 'weapon', label: 'Weapons', title: 'Weapons', icon: '🗡️', color: 'bg-red-100' },
              { value: 'armor', label: 'Armor', title: 'Armor', icon: '🛡️', color: 'bg-blue-100' },
              { value: 'trinket', label: 'Trinkets', title: 'Trinkets', icon: '💍', color: 'bg-yellow-100' },
              { value: 'scroll', label: 'Scrolls', title: 'Scrolls', icon: '📜', color: 'bg-amber-100' },
            ]}
            value={category}
            onChange={(v)=>setCategory(v)}
            columns={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Rarity</label>
          <IconPicker
            name="rarity"
            options={RARITIES.map(r=>({ value:r, label:r, title:r, icon: r === 'Legendary' ? '💎' : '♦️', color: r === 'Legendary' ? 'bg-yellow-200' : r === 'Rare' ? 'bg-indigo-100' : r === 'Uncommon' ? 'bg-green-100' : 'bg-gray-100' }))}
            value={rarity}
            onChange={(v)=>setRarity(v)}
            columns={4}
          />
        </div>

        {category === 'weapon' && (
          <div>
            <label className="block text-sm font-semibold mb-2">Weapon Type</label>
            <IconPicker
              name="weapontype"
              options={WEAPON_TYPES.map(w=>({ value:w, label:w, title:w, icon:w[0] }))}
              value={weaponType}
              onChange={(v)=>setWeaponType(v)}
              columns={5}
            />
          </div>
        )}

        {category === 'armor' && (
          <div>
            <label className="block text-sm font-semibold mb-2">Armor Type</label>
            <IconPicker
              name="armortype"
              options={ARMOR_TYPES.map(a=>({ value:a, label:a, title:a }))}
              value={armorType}
              onChange={(v)=>setArmorType(v)}
              columns={4}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">Theme</label>
          <IconPicker
            name="theme"
            options={THEMES.map(t=>({ value:t, label:t, title:t }))}
            value={theme}
            onChange={(v)=>setTheme(v)}
            columns={5}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Make it weird</label>
            <button
              aria-pressed={weird}
              onClick={()=>setWeird(!weird)}
              className={`w-12 h-6 rounded-full p-0.5 transition-all ${weird ? 'bg-purple-500 shadow-[0_0_12px_rgba(124,58,237,0.4)]' : 'bg-gray-300'}`}
              title="Toggle weird effects"
            >
              <span className={`block w-5 h-5 bg-white rounded-full transform transition ${weird ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </button>
          </div>

          <div className="ml-auto">
            <Button variant="primary" onClick={onGenerate} className="relative overflow-hidden">
              <span className="z-10 relative">Forge Item</span>
              <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-transparent opacity-0 hover:opacity-30 transition-opacity"></span>
            </Button>
          </div>
        </div>

      </div>

      {result && (
        <div className="mt-4">
          <div className="relative bg-amber-50 border-2 border-brown-400 rounded-lg p-6 shadow-lg" style={{backgroundImage: 'linear-gradient(180deg, rgba(255,250,240,0.9), rgba(255,245,230,0.8))'}}>
            <div className="absolute -inset-1 rounded-lg pointer-events-none" style={{boxShadow: 'inset 0 0 0 3px rgba(90,53,15,0.12)'}}></div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-3">
                  {result.name}
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                    result.rarity === 'Legendary' ? 'bg-yellow-400 text-black' :
                    result.rarity === 'Rare' ? 'bg-indigo-500 text-white' :
                    result.rarity === 'Uncommon' ? 'bg-green-400 text-black' : 'bg-gray-200 text-black'
                  }`}>{result.rarity}</span>
                </h3>
                <div className="mt-2 text-sm text-gray-700 italic">{result.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={copyResultText}>{copied ? 'Copied!' : 'Copy'}</Button>
              </div>
            </div>
            <ul className="mt-4 list-disc pl-6 space-y-1">
              {result.affixes.map((a:any, i:number)=> <li key={i} className="text-sm">{a}</li> )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
