// Replacement implementation: Clean sidebar & polished, copyable item cards
"use client"

import React from 'react'

// --- Basic tables kept small & readable ---
const WEAPON_TYPES = ['Sword','Axe','Dagger','Mace','Bow','Crossbow','Spear','Staff','Warhammer','Greatsword']
const ARMOR_TYPES = ['Light Armor','Medium Armor','Heavy Armor','Shield']
const THEMES = ['Random','Martial','Arcane','Divine','Primal','Shadow','Utility','Elemental','Fey','Celestial','Necrotic','Technomancy','Eldritch']
const RARITIES = ['Common','Uncommon','Rare','Very Rare','Legendary']

const CATEGORY_ICONS: Record<string,string> = {
  weapon: '🗡️',
  armor: '🛡️',
  trinket: '💍',
  scroll: '📜',
}

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
  'Wyrm‑tooth','Starwrought','Grimwarden','Kindled','Moonlit','Sun‑kissed'
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
  Elemental: ['Warm with residual elemental energy','Crackles with heat or cold'],
  Fey: ['Prismatic motes dance around it','Smells of wildflowers and mischief'],
  Celestial: ['A thin halo of light clings to the item','Soft choral hum when raised'],
  Necrotic: ['A cold, dry whisper follows it','Edges show faint blackened runes'],
  Technomancy: ['Small gears tick inside when agitated','Ozone and machine oil'],
  Eldritch: ['Unnatural geometry shivers across its surface','A low, discordant chord plays when used'],
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
    ],
    Rare: [
      '+2 bonus to attack and damage rolls',
      'Elemental Brand: while activated, add +1d6 fire/cold/lightning to hits (10 min, 1/short rest)',
      'Vicious: on a critical hit, deal +2d6 damage',
    ],
    'Very Rare': [
      '+3 bonus to attack and damage rolls',
      'Keen Edge: scores a critical hit on a 19–20',
      'Oathbound: once per short rest, mark a creature; first hit each turn adds +1d8 damage',
    ],
    Legendary: [
      '+3 bonus; attacks ignore nonmagical resistance',
      'Sunblade‑like: weapon deals radiant damage; +2d8 vs undead; daylight 30 ft',
      'Recall: as a bonus action, the weapon teleports to your hand from up to 1 mile (same plane)',
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
      'Quick‑strap: donning or doffing takes half the usual time',
      'Silent Straps: advantage on Stealth checks to avoid armor noise',
    ],
    Rare: [
      '+2 bonus to AC (armor or shield)',
      'Reactive plating: once per short rest, reduce a hit by 1d8',
      'Resistance to one damage type (choose fire, cold, lightning, necrotic, radiant)',
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
      'Cloak/Ring‑like: +1 to AC and saving throws (does not stack with itself)',
      'Minor ward: grants +1 to a chosen skill while attuned',
      'Feather Fall charm (1 charge/day)',
    ],
    Rare: [
      'Amulet of Health‑lite: your CON increases by +2 (max 20) while attuned',
      'Boots‑like: gain 10 ft bonus to movement',
      'Wand‑like (5 charges): cast a 2nd‑level spell tied to theme; regains 1d4+1 charges at dawn',
    ],
    'Very Rare': [
      'Resistance (permanent) to one damage type of the item’s theme',
      'Once per short rest, bonus action: become invisible until end of your next turn',
      'Spell DC +1 while attuned',
    ],
    Legendary: [
      'Once per long rest, cast a 6th‑level spell tied to theme',
      'Fate Thread: when you fail a save, turn it into a success 1/long rest',
      'You can’t be surprised while conscious',
    ],
  },
}

const RARITY_BADGE_CLASSES: Record<string,string> = {
  Common: 'bg-gray-200 text-gray-800',
  Uncommon: 'bg-amber-200 text-amber-800',
  Rare: 'bg-rose-200 text-rose-800',
  'Very Rare': 'bg-indigo-200 text-indigo-900',
  Legendary: 'bg-yellow-200 text-yellow-900',
}

// --- Utility helpers ---
function rand<T>(arr:T[]): T { return arr[Math.floor(Math.random()*arr.length)] }
function pick(arr:string[], n:number){ const pool=[...arr]; const out:string[]=[]; while(out.length<n&&pool.length){ out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]) } return out }
function dndName(thing:string){ const r = Math.random(); if (r < 0.5) return `${rand(NAME_PREFIX)} ${thing} ${rand(NAME_SUFFIX)}`; if (r < 0.85) return `${rand(NAME_MAKERS)}’s ${thing} ${rand(NAME_SUFFIX)}`; return `${rand(NAME_PREFIX)} ${thing}` }
function themeIcon(t:string){
  switch(t){
    case 'Random': return '🎲'; case 'Arcane': return '🔮'; case 'Martial': return '🛡️'; case 'Divine': return '✨';
    case 'Primal': return '🌿'; case 'Shadow': return '🌑'; case 'Utility': return '⚙️'; case 'Elemental': return '🔥';
    case 'Fey': return '🧚'; case 'Celestial': return '🌟'; case 'Necrotic': return '☠️'; case 'Technomancy': return '🤖'; case 'Eldritch': return '🜇';
    default: return '⚙️'
  }
}

// --- Types ---
interface Item { id:string; name:string; category:'weapon'|'armor'|'trinket'|'scroll'; rarity:string; theme:string; attunement:boolean; typeLine:string; description:string; affixes:string[]; flavor?:string }

// --- Core generator ---
function generateOne(opts:{ category:'weapon'|'armor'|'trinket'|'scroll'; weaponType:string; armorType:string; rarity:string; theme:string }): Item {
  const { category, weaponType, armorType } = opts
  const rarity = opts.rarity
  const resolvedTheme = opts.theme === 'Random' ? rand(THEMES.filter(t=>t!=='Random')) : opts.theme
  const attunement = ATTUNE_BY_RARITY[rarity] ?? false

  let typeLine = ''
  let description = ''
  let affixes: string[] = []

  if (category === 'weapon'){
    typeLine = weaponType
    description = `${weaponType} — ${WEAPON_DAMAGE[weaponType] ?? '—'}`
    const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
    affixes = pick(EFFECTS.weapon[rarity as keyof typeof EFFECTS.weapon], take)
  } else if (category === 'armor'){
    typeLine = armorType
    const ac = armorType === 'Shield' ? ARMOR_BASE['Shield'] : ARMOR_BASE[armorType]
    description = `${armorType} — ${ac}`
    const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
    affixes = pick(EFFECTS.armor[rarity as keyof typeof EFFECTS.armor], take)
  } else if (category === 'scroll'){
    typeLine = 'Scroll'
    description = 'Spell scroll of a theme‑appropriate spell'
    const take = 1
    affixes = ['One‑time use. Casting ability per DM.']
  } else {
    typeLine = 'Wondrous item'
    description = 'Wondrous item (trinket)'
    const take = rarity === 'Legendary' ? 3 : rarity === 'Very Rare' ? 2 : 1
    affixes = pick(EFFECTS.trinket[rarity as keyof typeof EFFECTS.trinket], take)
  }

  const flavorList = THEME_FLAVOR[resolvedTheme] ?? ['']
  return {
    id: Math.random().toString(36).slice(2),
    name: dndName(typeLine),
    category,
    rarity,
    theme: resolvedTheme,
    attunement,
    typeLine,
    description,
    affixes,
    flavor: flavorList.length ? rand(flavorList) : undefined,
  }
}

function formatForCopy(i:Item, opts:{ style:'markdown'|'plain'; includeFlavor:boolean }){
  const headerMd = `**${i.name}** — ${i.typeLine}\n_${i.rarity} • ${i.theme}${i.attunement ? ' • Attunement' : ''}_`
  const headerPlain = `${i.name} — ${i.typeLine}\n${i.rarity} • ${i.theme}${i.attunement ? ' • Attunement' : ''}`
  const desc = i.description.includes('—') ? i.description.split('—').slice(1).join('—').trim() : i.description
  const rulesMd = i.affixes.map(a=>`• ${a}`).join('\n')
  const rulesPlain = i.affixes.map(a=>`- ${a}`).join('\n')
  const flavorMd = (opts.includeFlavor && i.flavor) ? `\n>*${i.flavor}*` : ''
  const flavorPlain = (opts.includeFlavor && i.flavor) ? `\n(${i.flavor})` : ''
  if (opts.style === 'plain'){
    return `${headerPlain}\n${desc}\n\n${rulesPlain}${flavorPlain}`
  }
  return `${headerMd}\n${desc}\n\n${rulesMd}${flavorMd}`
}

export default function MagicItemClient(){
  // left column state
  const [category, setCategory] = React.useState<'weapon'|'armor'|'trinket'|'scroll'>('weapon')
  const [weaponType, setWeaponType] = React.useState(WEAPON_TYPES[0])
  const [armorType, setArmorType] = React.useState(ARMOR_TYPES[0])
  const [rarity, setRarity] = React.useState('Uncommon')
  const [theme, setTheme] = React.useState('Martial')
  const [count, setCount] = React.useState(1)
  const [items, setItems] = React.useState<Item[]>([])
  const [copiedId, setCopiedId] = React.useState<string|null>(null)
  const [appendMode, setAppendMode] = React.useState(false)
  const [style, setStyle] = React.useState<'markdown'|'plain'>('markdown')
  const [includeFlavor, setIncludeFlavor] = React.useState(true)

  function forge(){
    const next: Item[] = []
    for(let n=0;n<count;n++){
      next.push(generateOne({ category, weaponType, armorType, rarity, theme }))
    }
    setItems(prev => appendMode ? [...prev, ...next] : next)
  }

  function randomize(){
    const cats: Array<'weapon'|'armor'|'trinket'|'scroll'> = ['weapon','armor','trinket','scroll']
    const c = rand(cats)
    setCategory(c)
    setRarity(rand(RARITIES))
    setTheme(rand(THEMES))
    setWeaponType(rand(WEAPON_TYPES))
    setArmorType(rand(ARMOR_TYPES))
    setCount(Math.floor(Math.random()*3)+1) // 1–3
  }

  async function copyItem(i:Item){
    await navigator.clipboard.writeText(formatForCopy(i, { style, includeFlavor }))
    setCopiedId(i.id)
    setTimeout(()=>setCopiedId(null), 1500)
  }
  async function copyAll(){
    await navigator.clipboard.writeText(items.map(it=>formatForCopy(it, { style, includeFlavor })).join('\n\n'))
    setCopiedId('ALL')
    setTimeout(()=>setCopiedId(null), 1500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr] p-4">
      {/* Left: simple form */}
      <section className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">Magic Item Generator</h2>
          <p className="text-sm opacity-70">Pick a few options and forge polished, copy‑ready cards.</p>

          <div className="flex gap-2 mb-2">
            <button className="btn btn-sm" onClick={randomize}>🎲 Randomize</button>
            <button className="btn btn-sm btn-ghost" onClick={()=>{ setItems([]); setCount(1); }}>Reset</button>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <select className="select select-bordered" value={category} onChange={e=>setCategory(e.target.value as any)}>
              <option value="weapon">Weapons</option>
              <option value="armor">Armor</option>
              <option value="trinket">Trinkets</option>
              <option value="scroll">Scrolls</option>
            </select>
          </div>

          {category==='weapon' && (
            <div className="form-control">
              <label className="label"><span className="label-text">Weapon Type</span></label>
              <select className="select select-bordered" value={weaponType} onChange={e=>setWeaponType(e.target.value)}>
                {WEAPON_TYPES.map(w=> (<option key={w} value={w}>{w}</option>))}
              </select>
            </div>
          )}

          {category==='armor' && (
            <div className="form-control">
              <label className="label"><span className="label-text">Armor Type</span></label>
              <select className="select select-bordered" value={armorType} onChange={e=>setArmorType(e.target.value)}>
                {ARMOR_TYPES.map(a=> (<option key={a} value={a}>{a}</option>))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Rarity</span></label>
              <select className="select select-bordered" value={rarity} onChange={e=>setRarity(e.target.value)}>
                {RARITIES.map(r=> (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Theme</span></label>
              <select className="select select-bordered" value={theme} onChange={e=>setTheme(e.target.value)}>
                {THEMES.map(t=> (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
          </div>

          {/* Output settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Output style</span></label>
              <select className="select select-bordered" value={style} onChange={e=>setStyle(e.target.value as 'markdown'|'plain')}>
                <option value="markdown">Markdown</option>
                <option value="plain">Plain text</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Include flavor</span></label>
              <input type="checkbox" className="toggle" checked={includeFlavor} onChange={e=>setIncludeFlavor(e.target.checked)} />
            </div>
          </div>
          <div className="form-control mt-2">
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="checkbox" checked={appendMode} onChange={e=>setAppendMode(e.target.checked)} />
              <span className="label-text">Append new items</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end mt-2">
            <div className="form-control">
              <label className="label"><span className="label-text">How many?</span></label>
              <input type="number" min={1} max={6} value={count} onChange={e=>setCount(Math.min(6, Math.max(1, Number(e.target.value)||1)))} className="input input-bordered" />
            </div>
            <button className="btn btn-primary mt-6" onClick={forge}>Forge Items</button>
          </div>
        </div>
      </section>

      {/* Right: results */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="flex items-center gap-2">
            <label className="label cursor-pointer gap-2 text-sm">
              <span className="opacity-70">Append</span>
              <input type="checkbox" className="toggle toggle-xs" checked={appendMode} onChange={e=>setAppendMode(e.target.checked)} />
            </label>
            {items.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={copyAll}>{copiedId==='ALL' ? 'Copied!' : 'Copy all'}</button>
            )}
          </div>
        </div>

        {items.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-70">No items yet. Pick options or hit <span className="font-semibold">Randomize</span>, then <span className="font-semibold">Forge Items</span>.</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((i)=>{
            const right = i.description.includes('—') ? i.description.split('—').slice(1).join('—').trim() : i.description
            return (
              <article
                key={i.id}
                tabIndex={0}
                role="button"
                aria-label={`Item ${i.name}. Press Enter to copy.`}
                onKeyDown={(e)=>{ if (e.key === 'Enter') { copyItem(i) } }}
                className="card bg-base-100 shadow-sm border transition-transform transform hover:scale-[1.01] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md bg-white/80 flex items-center justify-center text-2xl shadow-sm">{CATEGORY_ICONS[i.category]}</div>
                        <div className="min-w-0">
                          <h4 className="card-title leading-tight text-lg truncate">{i.name}</h4>
                          <div className="text-sm opacity-70 truncate">{i.typeLine} · <span className={`inline-block px-2 py-0.5 rounded ${RARITY_BADGE_CLASSES[i.rarity] || 'bg-gray-200'}`}>{i.rarity}</span> <span className="ml-2">{themeIcon(i.theme)} {i.theme}</span>{i.attunement ? <span className="ml-2 inline-block px-2 py-0.5 border rounded text-xs">Attunement</span> : null}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={()=>copyItem(i)}>{copiedId===i.id ? 'Copied!' : 'Copy'}</button>
                      <button className="btn btn-outline btn-xs" onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(i, null, 2)); setCopiedId(i.id); setTimeout(()=>setCopiedId(null),1500) }}>JSON</button>
                    </div>
                  </div>

                  <p className="text-sm mt-3 text-gray-800">{right}</p>

                  <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-gray-700">
                    {i.affixes.map((a,idx)=>(<li key={idx}>{a}</li>))}
                  </ul>

                  {i.flavor && (
                    <p className="italic text-sm opacity-80 mt-3">“{i.flavor}”</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
