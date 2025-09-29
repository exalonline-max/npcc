'use client'
import React from 'react'

export function Select({ value, onValueChange, children }: any){
  return <div className="w-full">{children}</div>
}

export function SelectTrigger({ children }: any){
  return <div className="border rounded p-2">{children}</div>
}
export function SelectValue({ placeholder }: any){
  return <span className="text-sm text-gray-600">{placeholder}</span>
}
export function SelectContent({ children }: any){
  return <div className="mt-1">{children}</div>
}
export function SelectItem({ value, children }: any){
  return <div className="p-2 border rounded mb-1 cursor-pointer" onClick={() => { /* handled by parent wrapper */ }}>{children}</div>
}

export default Select
