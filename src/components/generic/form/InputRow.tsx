import { Text } from '@/components/generic/Text'

export const InputRow = ({
  title,
  desc,
  children,
  borderTop = true,
  borderBottom = true,
  isRow = true
}: {
  title: string
  desc?: string
  children: React.ReactNode
  borderTop?: boolean
  borderBottom?: boolean
  isRow?: boolean
}) => {
  return (
    <div
      className={`w-full ${borderTop && 'border-t'} ${borderBottom && 'border-b'} border-brease-gray-4 flex ${isRow ? 'flex-row' : 'flex-col'} items-start justify-between py-4 gap-4`}
    >
      <div className="w-fit flex flex-col max-w-[400px]">
        <Text size="md" style="medium">
          {title}
        </Text>
        {desc && (
          <Text size="xs" style="regular" className="text-brease-gray-8">
            {desc}
          </Text>
        )}
      </div>
      {children}
    </div>
  )
}
