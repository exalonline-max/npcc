/* Local, deterministic generator for quick item previews.
   Exports a function `generateItems(input, count)` that returns `count` items.
*/
// lightweight id generator (avoid adding an npm dependency)
function uid(){ return Math.random().toString(36).slice(2,9) }

const PREFIX = ['Runed','Dragonforged','Gloaming','Brightsteel','Stormbound','Oathkeeper','Wyrm-tooth','Starwrought','Grimwarden','Kindled','Moonlit','Sun-kissed']
const SUFFIX = ['of Warding','of the North Wind','of Quiet Death','of the Phoenix','of the Dawn','of the Deep Wood','of Sacred Oaths','of Whispers','of the Silver Host','of the Undying Light']

const RARITIES = ['Common','Uncommon','Rare','Very Rare','Legendary']

type Input = {
  recipient?: string
  slot: 'weapon'|'armor'|'trinket'
  level: number
  theme?: string
  tone?: string
  hook?: string
}

export type LocalItem = {
  id: string
  name: string
  slot: string
  rarity: string
  description: string
  affixes: string[]
  flavor?: string
  level: number
  theme?: string
}

function pick<T>(arr:T[]){ return arr[Math.floor(Math.random()*arr.length)] }

function makeName(slot:string, hook?:string){
  if (hook && Math.random() < 0.35) return `${hook}`
  const p = pick(PREFIX)
  const s = Math.random() < 0.6 ? `${pick(SUFFIX)}` : ''
  return `${p} ${slot}${s ? ' ' + s : ''}`
}

function deriveRarity(level:number, tone?:string){
  const base = Math.min(4, Math.floor(level / 6)) // 0..4 roughly
  if (tone === 'Legendary') return 'Legendary'
  if (tone === 'Cursed') return level > 10 ? 'Rare' : 'Uncommon'
  return RARITIES[Math.max(0, Math.min(4, base))]
}

function makeAffixes(slot:string, rarity:string, theme?:string, level?:number){
  const out: string[] = []
  const count = rarity === 'Legendary' ? 4 : rarity === 'Very Rare' ? 3 : rarity === 'Rare' ? 3 : rarity === 'Uncommon' ? 2 : 1
  const pool = {
    weapon: ['+1 to attack and damage','Counts as magical','Advantage vs disarm','Returning (thrown)','Once/short rest: +1d4 damage'],
    armor: ['+1 AC','Silent straps: advantage on Stealth','Quick-mend auto-repairs','Reduce fall damage by 1d6','Reactive plating: reduce a hit by 1d8 once/short rest'],
    trinket: ['Guidance once/day','Hidden compartment','+1 to a skill while attuned','Feather fall charm','Echo locket records a sound']
  } as any

  for (let i=0;i<count;i++){
    const candidate = pool[slot][Math.floor(Math.random()*pool[slot].length)]
    if (!out.includes(candidate)) out.push(candidate)
  }
  // flavor-affix from theme
  if (theme && Math.random() < 0.6) out.push(`${theme} resonance: small extra effect`)
  return out
}

export function generateItems(input: Input, count = 3): LocalItem[]{
  const items: LocalItem[] = []
  for (let i=0;i<count;i++){
    const name = makeName(input.slot, input.hook)
    const rarity = deriveRarity(input.level, input.tone)
    const affixes = makeAffixes(input.slot, rarity, input.theme, input.level)
    const desc = input.slot === 'weapon' ? `${input.slot.charAt(0).toUpperCase()+input.slot.slice(1)} — 1d8 (scaled)` : input.slot === 'armor' ? `${input.slot} — +AC` : `Wondrous item (trinket)`
  items.push({ id: uid(), name, slot: input.slot, rarity, description: desc, affixes, flavor: input.hook || undefined, level: input.level, theme: input.theme })
  }
  return items
}

export default generateItems
