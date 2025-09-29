'use client'
import React from 'react'

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-md border p-4 ${className}`}>{children}</div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2">{children}</div>
)
export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-lg font-semibold">{children}</div>
)
export const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-gray-600">{children}</div>
)
export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`pt-2 ${className}`}>{children}</div>
)

export default Card
