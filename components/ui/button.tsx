'use client'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'toggle'

export function Button({ children, onClick, disabled, variant = 'primary', active = false, className = '' }: { children: React.ReactNode; onClick?: any; disabled?: boolean; variant?: Variant; active?: boolean; className?: string }){
  // base uses existing global .btn styles where possible
  const base = 'inline-flex items-center justify-center rounded-md border select-none';
  let cls = `${base} ${className}`;

  if (variant === 'primary') cls += ' btn btn-primary';
  else if (variant === 'secondary') cls += ' btn btn-outline';
  else if (variant === 'ghost') cls += ' btn btn-ghost';
  else if (variant === 'toggle') cls += active ? ' btn btn-primary' : 'btn btn-outline';

  return (
    <button
      aria-pressed={variant === 'toggle' ? !!active : undefined}
      className={cls}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
