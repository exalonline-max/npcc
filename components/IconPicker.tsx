"use client"

import React from 'react'

type Option = {
  value: string
  label: string
  icon?: React.ReactNode
  title?: string
  color?: string
}

type Props = {
  name: string
  options: Option[]
  value: string
  onChange: (v:string)=>void
  columns?: number
}

export default function IconPicker({ name, options, value, onChange, columns=4 }:Props){
  const [focused, setFocused] = React.useState<number>(0)

  React.useEffect(()=>{
    // keep focus index in range when options change
    if (focused >= options.length) setFocused(0)
  },[options.length])

  function onKeyDown(e:React.KeyboardEvent<HTMLButtonElement>, idx:number){
    const cols = columns
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % options.length
    if (e.key === 'ArrowLeft') next = (idx - 1 + options.length) % options.length
    if (e.key === 'ArrowDown') next = (idx + cols) % options.length
    if (e.key === 'ArrowUp') next = (idx - cols + options.length) % options.length
    if (next !== idx){
      e.preventDefault()
      setFocused(next)
      const el = document.getElementById(`${name}-opt-${next}`) as HTMLButtonElement | null
      el?.focus()
    }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(options[idx].value) }
  }

  return (
    <div className={`grid gap-2`} style={{gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`}} role="list" aria-label={name}>
      {options.map((opt, i)=>{
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            id={`${name}-opt-${i}`}
            role="button"
            aria-pressed={selected}
            title={opt.title ?? opt.label}
            tabIndex={i === focused ? 0 : -1}
            onFocus={()=>setFocused(i)}
            onKeyDown={(e)=>onKeyDown(e,i)}
            onClick={()=>onChange(opt.value)}
            className={`relative flex items-center justify-center flex-col gap-1 p-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2
              ${selected ? 'ring-4 ring-opacity-60 transform scale-105' : 'hover:scale-105'}
              ${opt.color ?? 'bg-gray-800/5'}
            `}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-md text-xl`}>
              {opt.icon ?? <span aria-hidden className="text-sm font-medium">{opt.label.slice(0,2)}</span>}
            </div>
            <div className="text-xs text-center" aria-hidden>{opt.label}</div>
          </button>
        )
      })}
    </div>
  )
}
