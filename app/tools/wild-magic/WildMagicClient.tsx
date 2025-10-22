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

  async function roll(){
    const list = await loadEffects()
    if (!list || list.length === 0) return
    const i = Math.floor(Math.random() * list.length)
    setIndex(list[i].id)
    setResult(list[i].text)
    // keep the viewport focused on the top result area (avoid scrolling down to the table)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // flash animation for the big reveal
    setFlash(true)
    setShake(true)
    setTimeout(() => setFlash(false), 900)
    setTimeout(() => setShake(false), 420)
    spawnConfetti()
  }

  // keyboard shortcut: 'r' to roll
  React.useEffect(()=>{
    const onKey = (e:KeyboardEvent) => { if (e.key.toLowerCase() === 'r') roll() }
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

  return (
  <div className={"space-y-4" + (shake ? ' shake' : '')}>
      <div className="flex gap-2 items-center">
        <Button variant="primary" onClick={roll}>Roll for Wild Magic</Button>
        <Button variant="secondary" onClick={() => { setResult(null); setIndex(null) }}>Clear</Button>
      </div>

      <div className="p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold">Result</h3>
        <div id="confetti-root" className="confetti-container" style={{position:'relative', height:0}} />
        {result ? (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{display:'flex',flexDirection:'column'}}>
                <div className="text-sm text-gray-500">Effect #{index}</div>
                <div className={"mt-2 wild-effect" + (flash ? ' flash' : '')} style={{fontSize:18,lineHeight:1.3}}>
                  {flash ? <span className="reveal">{result}</span> : result}
                </div>
              </div>
              <div style={{marginLeft:'auto',display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                <div style={{padding:'6px 10px',borderRadius:999,background:`linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,boxShadow:`0 6px 18px ${rarityColor(getRarity(index))}33`,display:'flex',alignItems:'center',gap:8}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill={rarityColor(getRarity(index))} /></svg>
                  <span style={{fontSize:12,fontWeight:600,color:rarityColor(getRarity(index))}}>{getRarity(index)}</span>
                </div>
                <div style={{marginTop:8}}>
                  <small className="text-xs text-gray-500">Rarity influences game impact</small>
                  {signedIn === false && <a href="/signin" className="text-sm text-blue-600">Sign in to send</a>}
                  {signedIn === true && <span className="text-sm text-green-600">Signed in</span>}
                </div>
              </div>
            </div>
                <div className="mt-2">
                  <button className="btn copy-btn" onClick={copyResult}>Copy</button>
                  <button className="btn ml-2" onClick={sendToDiscord} disabled={!index || signedIn === false}>{signedIn === false ? 'Sign in to send' : 'Send to Discord'}</button>
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
          <div className="mt-2 space-y-2 max-h-72 overflow-auto p-2 border rounded bg-white">
            {effects ? (
              effects.map((e:any) => (
                <div key={e.id} id={`wm-${e.id}`} className={index === e.id ? 'p-2 rounded bg-yellow-50' : ''}><strong>#{e.id}:</strong> {e.text}</div>
              ))
            ) : (
              <div className="text-sm text-gray-600">Table will appear after first load.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
