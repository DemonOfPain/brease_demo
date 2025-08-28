import React, { ReactNode } from 'react'
import { Text } from '../Text'

interface FormLayoutRowInterface {
  title: string
  description?: string
  children: ReactNode
  hasSeparator?: boolean
  className?: string
}

export const FormLayoutRow = ({
  title,
  description,
  children,
  hasSeparator = true
}: FormLayoutRowInterface) => {
  return (
    <div
      className={`w-full flex flex-row items-center justify-between gap-4 flex-wrap py-6 pr-1${hasSeparator ? ' border-b border-brease-gray-4' : ''}`}
    >
      <div className="w-fit flex flex-col">
        <Text size="md" style="medium">
          {title}
        </Text>
        {description && (
          <Text size="sm" style="regular" htmlTag="span" className="text-brease-gray-7">
            {description}
          </Text>
        )}
      </div>
      {children}
    </div>
  )
}
