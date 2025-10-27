"use client"

import React from 'react'
import Button from '../../../components/ui/button'


const WEAPON_TYPES = ['Sword','Axe','Dagger','Mace','Bow','Crossbow','Spear','Staff','Warhammer','Greatsword']
const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shield']
const THEMES = ['Martial','Arcane','Divine','Primal','Shadow','Utility']
const RARITIES = ['Common','Uncommon','Rare','Very Rare','Legendary']

// D&D-style lookup tables
const WEAPON_DAMAGE: Record<string,string> = {
  Sword: '1d8 slashing',
  Axe: '1d8 slashing',
  Dagger: '1d4 piercing (finesse, thrown 20/60)',
  Mace: '1d6 bludgeoning',
  Bow: '1d8 piercing (ammunition 150/600, two-handed)',
  Crossbow: '1d8 piercing (ammunition 80/320, loading, two-handed)',
  Spear: '1d6 piercing (thrown 20/60, versatile 1d8)',
  Staff: '1d6 bludgeoning (versatile 1d8)',
  Warhammer: '1d8 bludgeoning (versatile 1d10)',
  Greatsword: '2d6 slashing (heavy, two-handed)'
}

const ARMOR_BASE: Record<string,string> = {
  'Light Armor': '11 + Dex',
  'Medium Armor': '14 + Dex (max 2)',
  'Heavy Armor': '18 (Str 15, Stealth Disadv.)',
  'Shield': '+2 AC (stacks with armor)'
}

const ATTUNE_BY_RARITY: Partial<Record<string, boolean>> = {
  Uncommon: false,
  Rare: true,
  'Very Rare': true,
  Legendary: true,
}

const NAME_PREFIX = [
  'Runed','Dragonforged','Gloaming','Brightsteel','Stormbound','Oathkeeper',
  'Wyrm-tooth','Starwrought','Grimwarden','Kindled','Moonlit','Sun-kissed'
]
const NAME_SUFFIX = [
  'of Warding','of the North Wind','of Quiet Death','of the Phoenix',
  'of the Dawn','of the Deep Wood','of Sacred Oaths','of Whispers',
  'of the Silver Host','of the Undying Light'
]
const NAME_MAKERS = ['Eldrin','Vessa','Thorn','Durgan','Maelis','Ser Joric','Aerendel','Sable']

const THEME_FLAVOR: Record<string,string[]> = {
  Martial: ['Leather wraps smell faintly of oil and smoke','Etched with old campaign marks'],
  Arcane: ['Hums softly with arcane resonance','Runes shift when read'],
  Divine: ['Warm to the touch and faintly luminous','Bears a sigil of sacred vows'],
  Primal: ['Bound with braided vine and tooth','Whispers of wind and beasts'],
  Shadow: ['Edges drink the light','Cold haze trails in darkness'],
  Utility: ['Fitted with clever catches and gears','Faint scent of ozone and ink'],
}

const EFFECTS = {
  weapon: {
    Common: [
      'Counts as magical for overcoming resistance',
      'Once per short rest, add +1d4 damage to one hit',
      'You can draw/stow this weapon as part of the attack',
    ],
    Uncommon: [
      '+1 bonus to attack and damage rolls',
      'Returning (thrown): the weapon flies back to your hand',
      'When you roll a 1 on damage, reroll it once',
      'Advantage on checks to avoid being disarmed',
    ],
    Rare: [
      '+2 bonus to attack and damage rolls',
      'Elemental Brand: while activated (bonus action), add +1d6 fire/cold/lightning to hits (10 min, 1/short rest)',
      'Undead Bane: +1d8 radiant vs undead and emits bright light 15 ft',
      'Vicious: on a critical hit, deal +2d6 damage',
      'Defender: as a bonus action, shift up to +2 of the bonus to AC until your next turn',
    ],
    'Very Rare': [
      '+3 bonus to attack and damage rolls',
      'Flame Tongue-like: speak command word to ignite (+2d6 fire); sheds bright light 40 ft',
      'Keen Edge: scores a critical hit on a 19–20',
      'Oathbound: once per short rest, mark a creature; first hit each turn adds +1d8 damage',
      'Spell Storing (3 charges): cast dispel magic or blink; regains 1d3 charges at dawn',
    ],
    Legendary: [
      '+3 bonus; attacks ignore nonmagical resistance',
      'Sunblade-like: weapon deals radiant damage; +2d8 vs undead; daylight 30 ft',
      'Vorpal-like edge: on a 20, deal +6d8 damage (DM adjudicates severe wound)',
      'Recall: as a bonus action, the weapon teleports to your hand from up to 1 mile (same plane)',
      'Once per long rest, cast steel wind strike (spell attack +10 / save DC 17 as appropriate)',
    ],
  },
  armor: {
    Common: [
      'Counts as magical',
      'Reduce fall damage by 1d6',
      'Advantage on saves to resist being shoved or knocked prone',
    ],
    Uncommon: [
      '+1 bonus to AC (armor or shield)',
      'Advantage on one type of save (choose STR/DEX/CON) vs environmental hazards',
      'Silent Straps: advantage on Stealth checks to avoid armor noise',
    ],
    Rare: [
      '+2 bonus to AC (armor or shield)',
      'Resistance to one damage type (choose fire, cold, lightning, necrotic, radiant)',
      'Guardian: once per short rest, impose disadvantage on an attack vs an ally within 5 ft',
    ],
    'Very Rare': [
      '+3 bonus to AC (armor or shield)',
      'Magic Ward (3 charges): reaction to add +4 to a saving throw; regains 1d3 charges at dawn',
      'You can breathe underwater and gain a swim speed equal to your speed',
    ],
    Legendary: [
      '+3 AC; critical hits against you become normal hits',
      'Bulwark: allies within 10 ft gain +1 to AC and saving throws while you are conscious',
      'Once per long rest, cast globe of invulnerability centered on you (1 minute)',
    ],
  },
  trinket: {
    Common: [
      'Tool boon: +2 bonus to checks with one artisan tool',
      'Once per long rest, cast guidance on yourself (no concentration for 1 minute)',
      'You always know which way is north and the time until sunrise/sunset',
    ],
    Uncommon: [
      'Cloak/Ring-like: +1 to AC and saving throws (does not stack with itself)',
      'Spellcasting focus: +1 to spell attack rolls',
      'Feather Fall charm (1 charge/day)',
    ],
    Rare: [
      'Amulet of Health-lite: your CON increases by +2 (max 20) while attuned',
      'Boots-like: gain 10 ft bonus to movement',
      'Wand-like (5 charges): cast a 2nd-level spell tied to theme; regains 1d4+1 charges at dawn',
    ],
    'Very Rare': [
      'Resistance (permanent) to one damage type of the item’s theme',
      'Once per short rest, bonus action: become invisible until end of your next turn',
      'Spell DC +1 while attuned',
    ],
    Legendary: [
      'Once per long rest, cast a 6th-level spell tied to theme',
      'Fate Thread: when you fail a save, turn it into a success 1/long rest',
      'You can’t be surprised while conscious',
    ],
  },
}

function pick(arr:string[], n:number){
  const pool = [...arr]; const out:string[] = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])
  }
  return out
}

function dndName(thing:string){
  const r = Math.random()
  if (r < 0.5) return `${rand(NAME_PREFIX)} ${thing} ${rand(NAME_SUFFIX)}`
  if (r < 0.85) return `${rand(NAME_MAKERS)}’s ${thing} ${rand(NAME_SUFFIX)}`
  return `${rand(NAME_PREFIX)} ${thing}`
}

function rand<T>(arr:T[]){ return arr[Math.floor(Math.random()*arr.length)] }

function roll(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }

// Simple local button-grid picker with clear selected styles
type PickerOption = { value:string; label:string; title?:string; icon?:string; color?:string }
function OptionGrid({ options, value, onChange, columns=4 }:{ options:PickerOption[]; value:string; onChange:(v:string)=>void; columns?:number }){
  return (
    <div className="grid gap-2" style={{gridTemplateColumns:`repeat(${columns}, minmax(0,1fr))`}}>
      {options.map((opt)=>{
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            title={opt.title || opt.label}
            onClick={()=>onChange(opt.value)}
            className={`group relative flex flex-col items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${selected ? 'border-amber-500 bg-amber-50 shadow-[0_0_0_2px_rgba(245,158,11,0.35)]' : 'border-gray-300 bg-white hover:border-gray-400'}`}
          >
            <span className="text-xl leading-none select-none">{opt.icon ?? ''}</span>
            <span className="leading-tight select-none">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

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
  return dndName(thing)
}

  function generateStats(thing:string){
    // Determine bucket by thing name
    const bucket: 'weapon'|'armor'|'trinket' = ((): any => {
      if (Object.prototype.hasOwnProperty.call(WEAPON_DAMAGE, thing)) return 'weapon'
      if (Object.prototype.hasOwnProperty.call(ARMOR_BASE, thing) || thing === 'Shield') return 'armor'
      return 'trinket'
    })()

    const attune = ATTUNE_BY_RARITY[rarity] ?? false
    const base:any = { name: makeName(thing), rarity, theme, attunement: attune, description: '', affixes: [] as string[] }

    if (bucket === 'weapon'){
      const dmg = WEAPON_DAMAGE[thing] ?? '—'
      base.description = `${thing} — ${dmg}`
      if (RARITIES.indexOf(rarity) >= RARITIES.indexOf('Uncommon')) base.affixes.push('This weapon is magical')
      const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
      base.affixes.push(...pick(EFFECTS.weapon[rarity as keyof typeof EFFECTS.weapon], take))
    } else if (bucket === 'armor'){
      const ac = thing === 'Shield' ? ARMOR_BASE['Shield'] : ARMOR_BASE[thing]
      base.description = `${thing} — ${ac}`
      const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
      base.affixes.push(...pick(EFFECTS.armor[rarity as keyof typeof EFFECTS.armor], take))
    } else {
      base.description = `Wondrous item (trinket)`
      const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
      base.affixes.push(...pick(EFFECTS.trinket[rarity as keyof typeof EFFECTS.trinket], take))
    }

    if (attune) base.affixes.unshift('Requires attunement')
    base.affixes.push(rand(THEME_FLAVOR[theme] ?? ['']))
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
      <h2 className="text-2xl font-bold">Magic Item Generator</h2>
      <p className="text-sm text-gray-600">Choose options below and forge a D&amp;D‑style magic item.</p>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <OptionGrid
            options={[
              { value: 'weapon', label: 'Weapons', title: 'Weapons', icon: '🗡️' },
              { value: 'armor', label: 'Armor', title: 'Armor', icon: '🛡️' },
              { value: 'trinket', label: 'Trinkets', title: 'Trinkets', icon: '💍' },
              { value: 'scroll', label: 'Scrolls', title: 'Scrolls', icon: '📜' },
            ]}
            value={category}
            onChange={(v)=>setCategory(v)}
            columns={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Rarity</label>
          <OptionGrid
            options={RARITIES.map(r=>({
              value:r,
              label:r,
              title:r,
              icon: r === 'Legendary' ? '💎' : r === 'Very Rare' ? '🔮' : '♦️',
            }))}
            value={rarity}
            onChange={(v)=>setRarity(v)}
            columns={5}
          />
        </div>

        {category === 'weapon' && (
          <div>
            <label className="block text-sm font-semibold mb-2">Weapon Type</label>
            <OptionGrid
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
            <OptionGrid
              options={ARMOR_TYPES.map(a=>({ value:a, label:a, title:a }))}
              value={armorType}
              onChange={(v)=>setArmorType(v)}
              columns={4}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">Theme</label>
          <OptionGrid
            options={THEMES.map(t=>({ value:t, label:t, title:t }))}
            value={theme}
            onChange={(v)=>setTheme(v)}
            columns={6}
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
                    result.rarity === 'Very Rare' ? 'bg-fuchsia-500 text-white' :
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
