'use client'
import React from 'react'

export function Button({ children, onClick, disabled, variant }: { children: React.ReactNode; onClick?: any; disabled?: boolean; variant?: 'secondary'|'ghost' }){
  const base = 'inline-flex items-center px-3 py-1.5 rounded-md border';
  const cls = variant === 'secondary' ? `${base} bg-gray-100` : `${base} bg-blue-600 text-white`;
  return <button className={cls} onClick={onClick} disabled={disabled}>{children}</button>
}

export default Button
