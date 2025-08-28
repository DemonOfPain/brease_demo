import React, { ReactNode } from 'react'

interface TextProps {
  size: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs' | 'xxxs'
  style: 'bold' | 'semibold' | 'medium' | 'regular'
  htmlTag?: 'p' | 'span' | 'blockquote' | 'code'
  children: ReactNode
  className?: string
}

export const Text = ({ size, style, htmlTag = 'p', children, className }: TextProps) => {
  switch (htmlTag) {
    case 'p':
      return (
        <p className={`${className ? className + ' ' : ''}text-t-${size} font-golos-${style}`}>
          {children}
        </p>
      )
    case 'span':
      return (
        <span className={`${className ? className + ' ' : ''}text-t-${size} font-golos-${style}`}>
          {children}
        </span>
      )
    case 'blockquote':
      return (
        <blockquote
          className={`${className ? className + ' ' : ''}text-t-${size} font-golos-${style}`}
        >
          {children}
        </blockquote>
      )
    case 'code':
      return (
        <code className={`${className ? className + ' ' : ''}text-t-${size} font-golos-${style}`}>
          {children}
        </code>
      )
    default:
      return <span>Something is wrong...</span>
  }
}
