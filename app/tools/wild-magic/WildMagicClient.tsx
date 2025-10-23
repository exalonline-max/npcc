"use client"

import React, { useState } from 'react'
import Button from '../../../components/ui/button'

export default function WildMagicClient(){
  const [result, setResult] = useState<string | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const [effects, setEffects] = useState<any[] | null>(null)
  const [legendaryIds, setLegendaryIds] = useState<number[] | null>(null)
  const [flash, setFlash] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [shake, setShake] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [narrativeVisible, setNarrativeVisible] = useState(true)
  const [combatVisible, setCombatVisible] = useState(true)

  async function loadEffects(){
    if (effects) return effects
    const res = await fetch('/api/wild-magic/effects')
    const data = await res.json()
    setEffects(data.effects)
    setLegendaryIds(Array.isArray(data.legendaryIds) ? data.legendaryIds : null)
    return data.effects
  }

  async function loadAuth(){
    try{
      const res = await fetch('/api/wild-magic/auth')
      const data = await res.json()
      setSignedIn(!!data?.signedIn)
    } catch (e){ setSignedIn(false) }
  }

  // generic roll helper that supports filtering by category
  function containsCondition(text: string){
    if (!text) return false
    const t = text.toLowerCase()
    const conditionWords = [
      'when you', 'when you ', 'open', 'open a', 'open the', 'nearest', 'within', 'near', 'hand', 'give', 'place', 'enter', 'the next', 'next ', 'next ', 'until the', 'as a bonus action', 'before', 'after', 'if ', 'the next creature', 'next creature', 'next small', 'next coin'
    ]
    return conditionWords.some(w => t.includes(w))
  }

  function isCombatEffect(text: string){
    if (!text) return false
    const t = text.toLowerCase()
    const combatWords = ['attack', 'damage', 'heal', 'hit points', 'teleport', 'flying', 'resistance', 'spell', 'fireball', 'lightning', 'action', 'guardian', 'flying speed', 'extra action', 'regain']
    return combatWords.some(w => t.includes(w))
  }

  async function pickAndReveal(list:any[]){
    if (!list || list.length === 0) return
    const i = Math.floor(Math.random() * list.length)
    setIndex(list[i].id)
    setResult(list[i].text)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    setFlash(true); setShake(true)
    setTimeout(() => setFlash(false), 900)
    setTimeout(() => setShake(false), 420)
    spawnConfetti()
  }

  async function rollCombat(){
    const list = await loadEffects()
    if (!list || list.length === 0) return
    // filter by category, filter out conditional effects, and prefer those that look combat-related
    const candidates = list.filter((e:any)=> normalizeCategory(e) === 'combat' && !containsCondition(e.text) && isCombatEffect(e.text))
    if (candidates.length === 0){
      // fallback: any non-conditional effect in the combat category
      const fallback = list.filter((e:any)=> normalizeCategory(e) === 'combat' && !containsCondition(e.text))
      await pickAndReveal(fallback.length ? fallback : list)
      return
    }
    await pickAndReveal(candidates)
  }

  async function rollNarrative(){
    const list = await loadEffects()
    if (!list || list.length === 0) return
    // narrative = category narrative, non-conditional, and not combat-related
    const candidates = list.filter((e:any)=> normalizeCategory(e) === 'narrative' && !containsCondition(e.text) && !isCombatEffect(e.text))
    if (candidates.length === 0){
      const fallback = list.filter((e:any)=> normalizeCategory(e) === 'narrative' && !containsCondition(e.text))
      await pickAndReveal(fallback.length ? fallback : list)
      return
    }
    await pickAndReveal(candidates)
  }

  // keyboard shortcuts: 'r' for narrative, 'c' for combat
  React.useEffect(()=>{
    const onKey = (e:KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'r') rollNarrative()
      if (k === 'c') rollCombat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [effects])

  // load auth status once
  React.useEffect(()=>{ loadAuth() }, [])

  async function copyResult(){
    if (!result) return
    await navigator.clipboard.writeText(`${index}: ${result}`)
    // tiny feedback
    setFlash(true)
    setTimeout(()=>setFlash(false), 700)
  }

  const [sendStatus, setSendStatus] = useState<string | null>(null)
  async function sendToDiscord(){
    if (!result) return
    setSendStatus('sending')
    try{
      const res = await fetch('/api/wild-magic/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: index })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'unknown error')
      setSendStatus('sent')
      setTimeout(()=>setSendStatus(null), 2000)
    } catch (err:any){
      setSendStatus('error: ' + (err?.message || String(err)))
    }
  }

  function getRarity(id?: number | null){
    if (!id) return 'Common'
    // prefer per-effect rarity if present
    const eff = effects?.find((e:any)=>e.id===id)
    if (eff && typeof eff.rarity === 'string') return eff.rarity
    if (legendaryIds && legendaryIds.includes(id)) return 'Legendary'
    // simple heuristic based on id ranges: most are Common
    if (id >= 271 && id <= 290) return 'Rare'
    if (id >= 241 && id <= 270) return 'Uncommon'
    return 'Common'
  }

  function rarityColor(r: string){
    switch(r){
      case 'Legendary': return '#D4AF37'
      case 'Rare': return '#6D28D9'
      case 'Uncommon': return '#059669'
      default: return '#374151'
    }
  }

  function spawnConfetti(){
    const container = document.getElementById('confetti-root')
    if (!container) return
    const colors = ['#FFD700','#FF6B6B','#6BCB77','#4D96FF','#C77DFF']
    const count = 18
    for (let i=0;i<count;i++){
      const el = document.createElement('div')
      el.className = 'confetti-particle'
      el.style.background = colors[Math.floor(Math.random()*colors.length)]
      const left = 40 + Math.random()*220
      el.style.left = `${left}px`
      el.style.top = `${10 + Math.random()*10}px`
      el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`
      el.style.animation = `confetti-fall ${800 + Math.floor(Math.random()*600)}ms cubic-bezier(.2,.8,.2,1) forwards`
      container.appendChild(el)
      setTimeout(()=>{ el.remove() }, 1600)
    }
  }

  // normalize categories: some effects were labeled "general" in the JSON
  // treat "general" as combat so old entries still appear in the Combat table
  function normalizeCategory(e:any){
    const c = (e && e.category) ? String(e.category).toLowerCase() : ''
    if (c === 'general') return 'combat'
    if (c === 'combat') return 'combat'
    if (c === 'narrative') return 'narrative'
    return c
  }

  return (
  <div className={"space-y-4" + (shake ? ' shake' : '')}>
      <div className="flex items-center" style={{gap:12,marginBottom:12}}>
        <div style={{display:'flex',gap:12}}>
          <Button variant="primary" onClick={rollCombat}>Roll Combat Wild Magic</Button>
          <Button variant="primary" onClick={rollNarrative}>Roll Narrative Wild Magic</Button>
        </div>
      </div>

      <div className="p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold">Result</h3>
        <div id="confetti-root" className="confetti-container" style={{position:'relative', height:0}} />
        {result ? (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{display:'flex',flexDirection:'column',flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div className="text-sm text-gray-500">Effect #{index}</div>
                  <div style={{padding:'4px 8px',borderRadius:999,display:'flex',alignItems:'center',gap:8,boxShadow:`0 6px 18px ${rarityColor(getRarity(index))}33`}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill={rarityColor(getRarity(index))} /></svg>
                    <span style={{fontSize:12,fontWeight:600,color:rarityColor(getRarity(index))}}>{getRarity(index)}</span>
                  </div>
                </div>
                <div className={"mt-2 wild-effect" + (flash ? ' flash' : '')} style={{fontSize:18,lineHeight:1.3}}>
                  {flash ? <span className="reveal">{result}</span> : result}
                </div>
              </div>
              <div style={{marginLeft:12,display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                <div style={{marginTop:8}}>
                  {signedIn === true && <div style={{marginTop:6}}><span className="text-sm text-green-600">Signed in</span></div>}
                </div>
              </div>
            </div>
                <div className="mt-2">
                  <button className="btn copy-btn" onClick={copyResult}>Copy</button>
                  {signedIn === true && <button className="btn ml-2" onClick={sendToDiscord} disabled={!index}>{'Send to Discord'}</button>}
                  {sendStatus && <span className="ml-2 text-sm text-gray-600">{sendStatus}</span>}
                </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">No result yet. Click the button to roll.</div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-md font-medium">Full Table</h4>
          <button className="btn btn-outline" onClick={async ()=>{ setShowTable(!showTable); if (!effects) await loadEffects() }}>{showTable ? 'Hide' : 'Show'}</button>
        </div>
        {showTable && (
          <div className="mt-2 p-2 bg-white" style={{border:'1px solid #e5e7eb',borderRadius:8,padding:12}}>
            {effects ? (
              <div>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <label className="text-sm">Narrative</label>
                    <select value={narrativeVisible ? 'show' : 'hide'} onChange={(ev)=>setNarrativeVisible(ev.target.value === 'show')} style={{padding:6,borderRadius:6}}>
                      <option value="show">Show</option>
                      <option value="hide">Hide</option>
                    </select>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <label className="text-sm">Combat</label>
                    <select value={combatVisible ? 'show' : 'hide'} onChange={(ev)=>setCombatVisible(ev.target.value === 'show')} style={{padding:6,borderRadius:6}}>
                      <option value="show">Show</option>
                      <option value="hide">Hide</option>
                    </select>
                  </div>
                </div>

                {/* Narrative table (stacked) */}
                {narrativeVisible && (
                  <div style={{border:'1px solid #e5e7eb',borderRadius:6,overflow:'hidden',marginBottom:12}}>
                    <div style={{maxHeight:600,overflow:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse'}}>
                        <thead>
                          <tr style={{position:'sticky',top:0,background:'#fff',zIndex:2,borderBottom:'1px solid #e5e7eb'}}>
                            <th style={{width:80,padding:10,textAlign:'left'}}>Number</th>
                            <th style={{padding:10,textAlign:'left'}}>Effect</th>
                            <th style={{width:120,padding:10,textAlign:'right'}}>Rarity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {effects.filter((e:any)=>normalizeCategory(e) === 'narrative').map((e:any)=> (
                            <tr key={e.id} className={index === e.id ? 'bg-yellow-50' : ''}>
                              <td style={{padding:10,verticalAlign:'top',whiteSpace:'nowrap'}}><strong>#{e.id}</strong></td>
                              <td style={{padding:10,verticalAlign:'top'}}>{e.text}</td>
                              <td style={{padding:10,verticalAlign:'top',textAlign:'right'}}>
                                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 8px',borderRadius:999,boxShadow:`0 6px 18px ${rarityColor(e.rarity || getRarity(e.id))}33`}}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill={rarityColor(e.rarity || getRarity(e.id))} /></svg>
                                  <span style={{fontSize:12,fontWeight:600,color:rarityColor(e.rarity || getRarity(e.id))}}>{e.rarity || getRarity(e.id)}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Combat table (stacked) */}
                {combatVisible && (
                  <div style={{border:'1px solid #e5e7eb',borderRadius:6,overflow:'hidden'}}>
                    <div style={{maxHeight:600,overflow:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse'}}>
                        <thead>
                          <tr style={{position:'sticky',top:0,background:'#fff',zIndex:2,borderBottom:'1px solid #e5e7eb'}}>
                            <th style={{width:80,padding:10,textAlign:'left'}}>Number</th>
                            <th style={{padding:10,textAlign:'left'}}>Effect</th>
                            <th style={{width:120,padding:10,textAlign:'right'}}>Rarity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {effects.filter((e:any)=>normalizeCategory(e) === 'combat').map((e:any)=> (
                            <tr key={e.id} className={index === e.id ? 'bg-yellow-50' : ''}>
                              <td style={{padding:10,verticalAlign:'top',whiteSpace:'nowrap'}}><strong>#{e.id}</strong></td>
                              <td style={{padding:10,verticalAlign:'top'}}>{e.text}</td>
                              <td style={{padding:10,verticalAlign:'top',textAlign:'right'}}>
                                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 8px',borderRadius:999,boxShadow:`0 6px 18px ${rarityColor(e.rarity || getRarity(e.id))}33`}}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill={rarityColor(e.rarity || getRarity(e.id))} /></svg>
                                  <span style={{fontSize:12,fontWeight:600,color:rarityColor(e.rarity || getRarity(e.id))}}>{e.rarity || getRarity(e.id)}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Table will appear after first load.</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 border rounded bg-gray-50 text-sm text-gray-700">
        <h4 className="font-semibold">Info</h4>
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Shortcuts:</strong> press <code>r</code> for Narrative roll, <code>c</code> for Combat roll.</li>
          <li><strong>Rarity:</strong> Common, Uncommon, Rare, Legendary — influences flavor and power.</li>
          <li><strong>Discord:</strong> the "Send to Discord" button is only visible if you are signed in.</li>
          <li><strong>Behavior:</strong> effects that required opening or being near something are filtered out so every result applies immediately.</li>
        </ul>
      </div>
    </div>
  )
}
