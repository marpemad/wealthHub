import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', onClick }) => (
  <div onClick={onClick} className={`card cursor-pointer hover:shadow-md transition-shadow ${className}`}>
    {title && <h3 className="text-lg font-bold mb-4 dark:text-white">{title}</h3>}
    {children}
  </div>
)
