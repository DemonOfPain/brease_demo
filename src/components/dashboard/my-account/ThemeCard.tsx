import { Text } from '@/components/generic/Text'
import Image from 'next/image'

interface ThemeCardProps {
  id?: any
  image?: any
  title: string
  description: string
  selected?: boolean
  onClick: () => void
}

export const ThemeCard = ({
  id,
  image,
  title,
  description,
  selected = false,
  onClick
}: ThemeCardProps) => {
  return (
    <div
      id={id}
      className={`${selected ? 'border-brease-green-9 bg-brease-green-1' : 'border-brease-gray-5 cursor-pointer'} w-[200px] h-[250px] p-4 rounded-lg border transition-all ease-in-out duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <Image src={image} alt="" className={`${image ? 'mb-2 border rounded-lg' : 'hidden'}`} />
      <Text style="semibold" size="md" className="text-brease-gray-10 mb-2">
        {title}
      </Text>
      <Text style="regular" size="xs" className="text-brease-gray-8">
        {description}
      </Text>
    </div>
  )
}
