import { Text } from '@/components/generic/Text'

export const TitleRow = ({
  title,
  desc,
  children
}: {
  title: string
  desc: string
  children?: React.ReactNode
}) => {
  return (
    <div className="w-full border-b-2 border-brease-gray-4 pb-4 flex flex-row items-center justify-between">
      <div className="w-fit flex flex-col">
        <Text size="xl" style="medium">
          {title}
        </Text>
        <Text size="xs" style="regular" className="text-brease-gray-8">
          {desc}
        </Text>
      </div>
      {children}
    </div>
  )
}
