"use client"

import React from 'react'
import Button from '../../../components/ui/button'


const WEAPON_TYPES = ['Sword','Axe','Dagger','Mace','Bow','Crossbow','Spear','Staff','Warhammer','Greatsword']
const WEAPON_ICONS: Record<string,string> = {
  Sword: '🗡️',
  Axe: '🪓',
  Dagger: '🗡️',
  Mace: '🔨',
  Bow: '🏹',
  Crossbow: '🏹',
  Spear: '🔱',
  Staff: '✨',
  Warhammer: '⚒️',
  Greatsword: '⚔️',
}
const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shield']
const THEMES = ['Random','Martial','Arcane','Divine','Primal','Shadow','Utility','Elemental','Fey','Celestial','Necrotic','Technomancy','Eldritch']
const RARITIES = ['Common','Uncommon','Rare','Very Rare','Legendary']

const CATEGORY_ICONS: Record<string,string> = {
  weapon: '🗡️',
  armor: '🛡️',
  trinket: '💍',
  scroll: '📜',
}

const RARITY_BADGE_CLASSES: Record<string,string> = {
  Common: 'bg-gray-200 text-gray-800',
  Uncommon: 'bg-amber-200 text-amber-800',
  Rare: 'bg-rose-200 text-rose-800',
  'Very Rare': 'bg-indigo-200 text-indigo-900',
  Legendary: 'bg-yellow-200 text-yellow-900',
}

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
  Elemental: ['Warm with residual elemental energy','Crackles faintly with heat or cold depending on mood'],
  Fey: ['Prismatic motes dance around it','Smells faintly of wildflowers and mischief'],
  Celestial: ['A thin halo of light clings to the item','Soft choral hum when held aloft'],
  Necrotic: ['A cold, dry whisper follows it','Edges show faint blackened runes'],
  Technomancy: ['Small gears tick inside when agitated','Faint scent of ozone and machine oil'],
  Eldritch: ['Unnatural geometry shivers across its surface','A low, discordant chord plays when used'],
}

function themeIcon(t:string){
  switch(t){
    case 'Random': return '🎲'
    case 'Arcane': return '🔮'
    case 'Martial': return '🛡️'
    case 'Divine': return '✨'
    case 'Primal': return '🌿'
    case 'Shadow': return '🌑'
    case 'Utility': return '⚙️'
    case 'Elemental': return '🔥'
    case 'Fey': return '🧚'
    case 'Celestial': return '🌟'
    case 'Necrotic': return '☠️'
    case 'Technomancy': return '🤖'
    case 'Eldritch': return '🜇'
    default: return '⚙️'
  }
}

const EFFECTS = {
  weapon: {
    Common: [
      'Counts as magical for overcoming resistance',
      'Balanced edge: grants a small steady bonus when used two-handed',
      'Comfort grip: grants +1 to recovery checks after combat',
      'Once per short rest, add +1d4 damage to one hit',
      'You can draw/stow this weapon as part of the attack',
    ],
    Uncommon: [
      '+1 bonus to attack and damage rolls',
      'Well-balanced haft: easier to maintain, reducing failure on repairs',
      'Returning (thrown): the weapon flies back to your hand',
      'When you roll a 1 on damage, reroll it once',
      'Advantage on checks to avoid being disarmed',
    ],
    Rare: [
      '+2 bonus to attack and damage rolls',
      'Serrated plan: on a critical, target bleeds for 1d4 until healed',
      'Elemental Brand: while activated (bonus action), add +1d6 fire/cold/lightning to hits (10 min, 1/short rest)',
      'Undead Bane: +1d8 radiant vs undead and emits bright light 15 ft',
      'Vicious: on a critical hit, deal +2d6 damage',
      'Defender: as a bonus action, shift up to +2 of the bonus to AC until your next turn',
    ],
    'Very Rare': [
      '+3 bonus to attack and damage rolls',
      'Phase Edge: once per short rest, ignore 5 points of armor on a hit',
      'Flame Tongue-like: speak command word to ignite (+2d6 fire); sheds bright light 40 ft',
      'Keen Edge: scores a critical hit on a 19–20',
      'Oathbound: once per short rest, mark a creature; first hit each turn adds +1d8 damage',
      'Spell Storing (3 charges): cast dispel magic or blink; regains 1d3 charges at dawn',
    ],
    Legendary: [
      '+3 bonus; attacks ignore nonmagical resistance',
      'Warden of Storms: occasionally crackles with thunder, granting thunderous bonus on hit',
      'Sunblade-like: weapon deals radiant damage; +2d8 vs undead; daylight 30 ft',
      'Vorpal-like edge: on a 20, deal +6d8 damage (DM adjudicates severe wound)',
      'Recall: as a bonus action, the weapon teleports to your hand from up to 1 mile (same plane)',
      'Once per long rest, cast steel wind strike (spell attack +10 / save DC 17 as appropriate)',
    ],
  },
  armor: {
    Common: [
      'Counts as magical',
      'Light padding: reduces chafing and grants comfort in long marches',
      'Reinforced seams: minor protection against wear and tear (reduces maintenance checks)',
      'Reduce fall damage by 1d6',
      'Advantage on saves to resist being shoved or knocked prone',
    ],
    Uncommon: [
      '+1 bonus to AC (armor or shield)',
      'Quick-mend: once per day, minor repairs auto-stitch (cosmetic only)',
      'Quick-strap: donning or doffing the armor takes half the usual time',
      'Advantage on one type of save (choose STR/DEX/CON) vs environmental hazards',
      'Silent Straps: advantage on Stealth checks to avoid armor noise',
    ],
    Rare: [
      '+2 bonus to AC (armor or shield)',
      'Temperature weave: grants comfort in extreme heat or cold, reducing exhaustion checks',
      'Reactive plating: once per short rest, reduce a hit by 1d8',
      'Resistance to one damage type (choose fire, cold, lightning, necrotic, radiant)',
      'Guardian: once per short rest, impose disadvantage on an attack vs an ally within 5 ft',
    ],
    'Very Rare': [
      '+3 bonus to AC (armor or shield)',
      'Harmonic wards: briefly grant advantage on one saving throw per short rest',
      'Spellbound weave: while worn, grants +1 to spellcasting concentration checks',
      'Magic Ward (3 charges): reaction to add +4 to a saving throw; regains 1d3 charges at dawn',
      'You can breathe underwater and gain a swim speed equal to your speed',
    ],
    Legendary: [
      '+3 AC; critical hits against you become normal hits',
      'Living Plate: the armor shifts to better protect vulnerable spots (DM adjudicates once/day)',
      'Aegis of Ages: once per long rest, reflect a single spell back at its caster',
      'Bulwark: allies within 10 ft gain +1 to AC and saving throws while you are conscious',
      'Once per long rest, cast globe of invulnerability centered on you (1 minute)',
    ],
  },
  trinket: {
    Common: [
      'Tool boon: +2 bonus to checks with one artisan tool',
      'Trinket clasp: won’t fall off in water or during acrobatics',
      'Pocket charm: small hidden compartment holds trivial items without adding weight',
      'Once per long rest, cast guidance on yourself (no concentration for 1 minute)',
      'You always know which way is north and the time until sunrise/sunset',
    ],
    Uncommon: [
      'Cloak/Ring-like: +1 to AC and saving throws (does not stack with itself)',
      'Subtle sigil: grants +1 to Persuasion checks in one social niche',
      'Minor ward: grants +1 to a chosen skill while attuned',
      'Spellcasting focus: +1 to spell attack rolls',
      'Feather Fall charm (1 charge/day)',
    ],
    Rare: [
      'Amulet of Health-lite: your CON increases by +2 (max 20) while attuned',
      'Echo locket: record a single short sound and play it back once per day',
      'Boots-like: brief feather-step ability once per short rest',
      'Boots-like: gain 10 ft bonus to movement',
      'Wand-like (5 charges): cast a 2nd-level spell tied to theme; regains 1d4+1 charges at dawn',
    ],
    'Very Rare': [
      'Resistance (permanent) to one damage type of the item’s theme',
      'Phase bead: once per long rest, ignore difficult terrain for 1 minute',
      'Ethereal echo: once per long rest, phase briefly into ethereal plane (1 round)',
      'Once per short rest, bonus action: become invisible until end of your next turn',
      'Spell DC +1 while attuned',
    ],
    Legendary: [
      'Once per long rest, cast a 6th-level spell tied to theme',
      'World-anchored charm: anchors a teleport tether to a chosen pocket dimension',
      'World-Touched: item grants a faint teleportation tether to a chosen location once per week',
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
        // when not selected, slightly dim and desaturate to emphasize chosen option
        const base = selected
          ? 'relative flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 border-2 shadow-md'
          : 'relative flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition transform hover:-translate-y-0.5 focus:outline-none opacity-70 hover:opacity-95 border'

        const selectedStyles = selected ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-500' : 'bg-white/5 text-gray-200 border-gray-700'

        const inlineStyle: React.CSSProperties = selected
          ? { background: 'linear-gradient(90deg,#f6ad55,#d97706)', color: 'white' }
          : { filter: 'grayscale(.15) opacity(.8)' }

        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            data-selected={selected ? 'true' : 'false'}
            title={opt.title || opt.label}
            onClick={()=>onChange(opt.value)}
            className={`group ${base} ${selectedStyles}`}
            style={inlineStyle}
          >
            <span className="text-2xl leading-none select-none">{opt.icon ?? ''}</span>
            <span className="leading-tight select-none mt-1">{opt.label}</span>
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
  const [result, setResult] = React.useState<any| null>(null)
  const [copied, setCopied] = React.useState<boolean>(false)
  const [aiLoading, setAiLoading] = React.useState<boolean>(false)
  const [aiSummary, setAiSummary] = React.useState<string | null>(null)
  const [aiBullets, setAiBullets] = React.useState<string[] | null>(null)
  const [aiError, setAiError] = React.useState<string | null>(null)

  // no wild-magic loading — "Make it weird" is temporarily removed

  // helper to update the current result object
  function updateResult(patch: Record<string, any>){
    setResult((prev:any) => prev ? { ...prev, ...patch } : prev)
  }

  function setAffix(idx:number, value:string){
    setResult((prev:any)=>{
      if (!prev) return prev
      const aff = [...(prev.affixes||[])]
      aff[idx] = value
      return { ...prev, affixes: aff }
    })
  }

  function addAffix(){
    setResult((prev:any)=>{
      if (!prev) return prev
      const aff = [...(prev.affixes||[]), 'New effect']
      return { ...prev, affixes: aff }
    })
  }

  function removeAffix(idx:number){
    setResult((prev:any)=>{
      if (!prev) return prev
      const aff = [...(prev.affixes||[])]
      aff.splice(idx,1)
      return { ...prev, affixes: aff }
    })
  }

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
      // resolve theme: if user chose 'Random', pick a concrete theme now
      const resolvedTheme = theme === 'Random' ? rand(THEMES.filter(t=>t !== 'Random')) : theme

      const attune = ATTUNE_BY_RARITY[rarity] ?? false
      const base:any = { name: makeName(thing), rarity, theme: resolvedTheme, attunement: attune, description: '', affixes: [] as string[], flavor: '' }
      // record the detected category so the UI can show an icon/badge
      ;(base as any).category = bucket

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

  // attunement is recorded separately on the item; avoid duplicating it in affixes
    // Set a dedicated flavor line (short italic text) instead of burying it in affixes
    base.flavor = rand(THEME_FLAVOR[resolvedTheme] ?? [''])
    return base
  }

  // removed weird attachments for now

  function onGenerate(){
    let thing = 'Trinket'
    if (category === 'weapon') thing = weaponType
    if (category === 'armor') thing = armorType
    const base = generateStats(thing)
  // previously could attach "weird" effects; currently disabled
    // set a quick immediate preview while we ask the AI to polish
    setResult(base)
  // preview only — AI enhance is manual now (use Enhance (AI) button)
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

  // Enhance an item via the AI endpoint. If `autoApply` is true, merge bullets into the
  // item's affixes and replace the description with the AI paragraph (if available).
  async function enhanceWithAI(itemParam?: any, autoApply = false){
    const target = itemParam ?? result
    if (!target) return
    setAiLoading(true)
    setAiError(null)
    setAiSummary(null)
    setAiBullets(null)
    try{
      const r = await fetch('/api/magic-item/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: target }),
      })
      const data = await r.json()
      if (!r.ok || data?.error) {
        setAiError(data?.error || `Status ${r.status}`)
      } else {
        const summary = data.summary ?? (typeof data === 'string' ? data : null)
        const bullets = Array.isArray(data.bullets) ? data.bullets : null
        setAiSummary(summary)
        setAiBullets(bullets)

        if (autoApply) {
          // attempt to extract a paragraph from the summary: split on double newlines
          let paragraph = ''
          if (typeof summary === 'string'){
            const parts = summary.split('\n\n').map(p=>p.trim()).filter(Boolean)
            // the first part might be the type line; if there's more than one part use the 2nd as paragraph
            paragraph = parts.length > 1 ? parts.slice(1).join('\n\n') : parts[0] ?? ''
          }

          setResult((prev:any)=>{
            if (!prev) return prev
            const mergedAffixes = prev.affixes ? [...prev.affixes] : []
            if (bullets && bullets.length) {
              // avoid exact duplicates
              bullets.forEach((b:string)=>{ if (!mergedAffixes.includes(b)) mergedAffixes.push(b) })
            }
            return { ...prev, description: paragraph || prev.description, affixes: mergedAffixes }
          })
        }
      }
    }catch(e:any){
      setAiError(String(e?.message ?? e))
    }finally{ setAiLoading(false) }
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">Magic Item Generator</h2>
      <p className="text-sm text-gray-600">Choose options below and forge a D&amp;D‑style magic item.</p>
      <div className="grid md:grid-cols-3 gap-6" style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem'}}>
        <div className="md:col-span-1" style={{minWidth: 260}}>
          <div className="grid grid-cols-1 gap-6">
            <div>
          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                const cats = ['weapon','armor','trinket','scroll']
                const c = rand(cats)
                setCategory(c)
                const r = rand(RARITIES)
                setRarity(r)
                setTheme(rand(THEMES))
                setWeaponType(rand(WEAPON_TYPES))
                setArmorType(rand(ARMOR_TYPES))
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-100 hover:bg-amber-200 border"
              title="Randomize options"
            >
              🎲 Randomize
            </button>
          </div>
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
              options={WEAPON_TYPES.map(w=>({ value:w, label:w, title:w, icon: WEAPON_ICONS[w] ?? w[0] }))}
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
              options={THEMES.map(t=>({ value:t, label:t, title:t, icon: themeIcon(t) }))}
              value={theme}
              onChange={(v)=>setTheme(v)}
              columns={6}
            />
        </div>

          <div className="flex items-center gap-4">
            <div className="ml-auto">
              <Button variant="primary" onClick={onGenerate} className="relative overflow-hidden">
                <span className="z-10 relative">Forge Item</span>
                <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-transparent opacity-0 hover:opacity-30 transition-opacity"></span>
              </Button>
            </div>
          </div>
              </div>
            </div>

            <div className="md:col-span-2">
            {result && (
              <div className="mt-4">
                <div
                  className="relative rounded-xl p-8 shadow-xl border-4 overflow-hidden"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #fff8ef, #fff3e6)',
                    borderStyle: 'solid',
                    borderImage: 'linear-gradient(90deg,#f6ad55,#d97706,#f472b6) 1',
                    boxShadow: '0 12px 30px rgba(16,24,40,0.08)'
                  }}
                >
                      {/* subtle inner parchment rim */}
                      <div className="absolute -inset-2 rounded-xl pointer-events-none" style={{boxShadow: 'inset 0 0 0 6px rgba(255,245,238,0.6)'}}></div>

                      {/* Top banner (name + small subtitle) */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-[92%] pointer-events-none">
                        {/* decorative ribbon SVG behind the banner text */}
                        <div className="ribbon" aria-hidden>
                          <svg viewBox="0 0 100 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="rg" x1="0" x2="1">
                                <stop offset="0" stopColor="#fff8ef" />
                                <stop offset="1" stopColor="#ffe9d6" />
                              </linearGradient>
                            </defs>
                            <path d="M0 8 C18 0 82 0 100 8 L100 24 C82 32 18 32 0 24 Z" fill="url(#rg)" stroke="#e6c0a0" strokeWidth="1.2"/>
                            {/* small left tail */}
                            <path d="M6 22 L0 28 L6 18" fill="#f7e9db" stroke="#e6c0a0" strokeWidth="0.8"/>
                            {/* small right tail */}
                            <path d="M94 22 L100 28 L94 18" fill="#f7e9db" stroke="#e6c0a0" strokeWidth="0.8"/>
                          </svg>
                        </div>

                        <div className="bg-transparent text-center py-3 pointer-events-auto">
                          <input
                            className="mx-auto block w-11/12 text-4xl fantasy-title text-rose-900 font-extrabold bg-transparent border-none focus:outline-none text-center"
                            value={result.name}
                            onChange={(e)=>updateResult({ name: e.target.value })}
                          />

                          <input
                            className="mt-1 block mx-auto w-10/12 text-sm italic text-gray-600 bg-transparent border-none focus:outline-none text-center"
                            value={result.typeLine ?? (() => {
                              const desc = result.description ?? ''
                              if (desc.startsWith('Wondrous')) return 'Wondrous item'
                              if (desc.includes('—')) return `${desc.split('—')[0].trim()}, ${String(result.rarity ?? '').toLowerCase()}`
                              return `${String(result.rarity ?? '')}`
                            })()}
                            onChange={(e)=>updateResult({ typeLine: e.target.value })}
                          />

                          <div className="text-xs text-gray-500 mt-2">
                            <label className="inline-flex items-center gap-2">
                              <input type="checkbox" className="form-checkbox" checked={!!result.attunement} onChange={(e)=>updateResult({ attunement: e.target.checked })} />
                              <span>{result.attunement ? 'Requires attunement' : 'No attunement required'}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Card body layout: make room for banner */}
                      <div className="pt-12">
                        {/* Center art / icon */}
                        <div className="flex items-center justify-center">
                          <div className="w-40 h-40 rounded-lg bg-white/90 flex items-center justify-center text-6xl shadow-md">{CATEGORY_ICONS[result.category] ?? themeIcon(result.theme)}</div>
                        </div>

                        {/* Parchment flavor box (flavor moved to bottom of card) */}
                        <div className="mt-6 mx-6 bg-white/95 border rounded-md p-4" style={{boxShadow: 'inset 0 0 0 6px rgba(245,238,224,0.6)'}}>
                          {/* editable stat/description */}
                          <div className="mt-3 text-sm text-gray-800 text-center">
                            {(() => {
                              const desc = result.description ?? ''
                              const computedType = result.typeLine ?? (desc.startsWith('Wondrous') ? 'Wondrous item' : (desc.includes('—') ? desc.split('—')[0].trim() : ''))
                              const right = desc.includes('—') ? desc.split('—').slice(1).join('—').trim() : (desc.startsWith('Wondrous') ? desc : desc)
                              return (
                                <div>
                                  <textarea
                                    className="w-full resize-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-center shadow-sm focus:ring-1 focus:ring-amber-200"
                                    rows={3}
                                    value={right}
                                    onChange={(e)=>{
                                      const newRight = e.target.value
                                      if (computedType) {
                                        updateResult({ description: `${computedType} — ${newRight}`, typeLine: computedType })
                                      } else {
                                        updateResult({ description: newRight })
                                      }
                                    }}
                                  />
                                </div>
                              )
                            })()}
                          </div>
                        </div>

                        {/* Rules / affixes list (bottom panel) */}
                        <div className="mt-4 mx-6 bg-white/95 border rounded-b-md p-3">
                          <div className="space-y-3 text-sm">
                            {(result.affixes || []).map((a:any, i:number)=> (
                              <div key={i} className="flex items-start gap-3">
                                <textarea
                                  className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
                                  rows={3}
                                  value={a}
                                  onChange={(e)=>setAffix(i, e.target.value)}
                                />
                                <button type="button" className="ml-2 text-sm text-red-600 hover:text-red-800" onClick={()=>removeAffix(i)}>Remove</button>
                              </div>
                            ))}

                            <div>
                              <Button variant="secondary" onClick={addAffix} className="mt-1">+ Add affix</Button>
                            </div>
                          </div>

                          {/* Flavor quote moved to bottom of card (inside rules panel) */}
                          {result.flavor && (
                            <div className="mt-3 text-center italic text-gray-700 px-3 py-2 bg-white/5 rounded-md">{`“${result.flavor}”`}</div>
                          )}
                        </div>

                        {/* Bottom actions row */}
                        <div className="mt-4 flex items-center justify-end gap-2 px-6">
                          <Button variant="secondary" onClick={() => enhanceWithAI(undefined, true)} disabled={aiLoading || !result}>
                            {aiLoading ? 'Summarizing…' : 'Enhance (AI)'}
                          </Button>
                          <Button variant="ghost" onClick={copyResultText}>{copied ? 'Copied!' : 'Copy'}</Button>
                        </div>
                      </div>
                </div>
              </div>
            )}

            {/* AI output panel — separate block to style independently */}
            <div className="mt-4">
              {aiError && <div className="text-sm text-red-600">AI error: {aiError}</div>}
              {aiSummary && (
                <div className="p-4 bg-white border rounded-md shadow-sm">
                  <div className="prose-sm"><div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>') }} /></div>
                  {aiBullets && aiBullets.length > 0 && (
                    <ul className="mt-2 list-disc pl-5">
                      {aiBullets.map((b,i)=>(<li key={i} className="text-sm">{b}</li>))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}
