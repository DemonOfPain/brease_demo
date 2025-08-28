'use client'
import { ReactNode } from 'react'
import Button from '@/components/generic/Button'
import { Text } from '@/components/generic/Text'
import { Title } from '@/components/generic/Title'
import { Check, X } from 'lucide-react'

interface PriceCardProps {
  id?: any
  title: string
  price: string
  priceTime: string
  description: string
  selected?: boolean
  buttonOnClick: () => void
  children?: ReactNode
}

export function PriceCard({
  id,
  title,
  price,
  priceTime,
  description,
  selected = false,
  buttonOnClick,
  children
}: PriceCardProps) {
  return (
    <div
      id={id}
      className={
        'hover:border-brease-gray-3 hover:shadow-brease-sm cursor-default  w-[300px] p-5 rounded-lg border transition-all ease-in-out duration-300 flex flex-wrap'
      }
    >
      <Text style="medium" size="sm" className="text-black mb-2">
        {title}
      </Text>
      <div className="w-full flex flex-row gap-2">
        <Title style="medium" size="md" className="text-black">
          {price}
        </Title>
        <Text style="medium" size="xxs" className="text-brease-gray-9 self-end mb-1.5">
          {priceTime}
        </Text>
      </div>
      <Text style="regular" size="sm" className="text-brease-gray-9">
        {description}
      </Text>
      {children}
      <div className="w-full">
        <Button
          variant={`${selected ? 'secondary' : 'primary'}`}
          size="sm"
          label={`${selected ? 'Current plan' : 'Get Started'}`}
          disabled={selected}
          className="w-full mt-4 h-10 !inline-block"
          onClick={buttonOnClick}
        />
      </div>
    </div>
  )
}

export const PriceCardListItem = ({
  checked,
  description
}: {
  checked?: boolean
  description: string
}) => {
  return (
    <li className="flex items-center content-center gap-1 font-golos-medium text-t-sm h-10">
      {checked ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {description}
    </li>
  )
}

export const PriceCardList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="w-full divide-y divide-brease-gray-3 mt-5">{children}</ul>
}
