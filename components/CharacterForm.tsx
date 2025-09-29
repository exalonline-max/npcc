"use client"

import { useState } from 'react'

export default function CharacterForm() {
  const [name, setName] = useState('')
  const [klass, setKlass] = useState('')
  const [level, setLevel] = useState(1)
  const [status, setStatus] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, class: klass, level })
      })
      if (res.ok) setStatus('saved')
      else setStatus('error')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={save} style={{ maxWidth: 420 }}>
      <div className="form-row">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Class</label>
        <input value={klass} onChange={e => setKlass(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Level</label>
        <input type="number" value={level} onChange={e => setLevel(Number(e.target.value))} min={1} max={20} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn btn-primary">Save</button>
        <div style={{ alignSelf: 'center' }}>{status}</div>
      </div>
    </form>
  )
}
