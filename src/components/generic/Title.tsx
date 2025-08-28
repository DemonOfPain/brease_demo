import React, { ReactNode } from 'react'

interface TitleProps {
  size: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  style: 'bold' | 'semibold' | 'medium' | 'regular'
  htmlTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: ReactNode
  className?: string
}

export const Title = ({ size, style, htmlTag = 'h1', children, className }: TitleProps) => {
  switch (htmlTag) {
    case 'h1':
      return (
        <h1 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h1>
      )
    case 'h2':
      return (
        <h2 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h3>
      )
    case 'h4':
      return (
        <h4 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h4>
      )
    case 'h5':
      return (
        <h5 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h5>
      )
    case 'h6':
      return (
        <h6 className={`${className ? className + ' ' : ''}text-d-${size} font-golos-${style}`}>
          {children}
        </h6>
      )
    default:
      return <span>Something is wrong...</span>
  }
}
