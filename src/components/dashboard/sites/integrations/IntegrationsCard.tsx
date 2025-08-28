import { Switch } from '@/components/shadcn/ui/switch'
import { StaticImageData } from 'next/image'
import Image from 'next/image'
import { Text } from '@/components/generic/Text'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'

interface IntegrationsCardInterface extends DisableDialogInterface {
  logo: StaticImageData | string
  dialog: React.ReactNode
}

type DisableDialogInterface = {
  name: string
  enabled: boolean
  onChange: {
    onEnable: () => void
    onDisable: () => void
  }
}

const DisableDialog = ({ name, enabled, onChange }: DisableDialogInterface) => {
  return (
    <div className="w-full flex flex-col gap-6 divide-y">
      <div className="flex flex-col gap-2 pt-6 px-6">
        <Text size="lg" style="semibold">
          Are you sure?
        </Text>
        <Text size="sm" style="regular">
          {`${enabled ? 'Disabling' : 'Enabling'} ${name} will take some time.`}
        </Text>
        <Text size="sm" style="regular" className="-mt-2">
          Check the applications official platform for up-to-date informations.
        </Text>
      </div>
      <div className="w-full flex flex-row justify-between items-center py-6 px-6">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={enabled ? onChange.onDisable : onChange.onEnable}>
          {enabled ? 'Disable' : 'Enable'}
        </AlertDialogAction>
      </div>
    </div>
  )
}

export const IntegrationsCard = ({
  logo,
  name,
  enabled,
  onChange,
  dialog
}: IntegrationsCardInterface) => {
  return (
    <div className="w-[228px] rounded-md border shadow-brease-xs border-brease-gray-4 px-5 py-4 flex flex-col gap-8 items-start justify-between">
      <Image src={logo} alt={name} className="w-fit h-[20px]" width={120} height={20} />
      <div className="w-full flex flex-col gap-4">
        <Text size="lg" style="semibold">
          {name}
        </Text>
        <div className="w-full flex flex-row items-start justify-between gap-4">
          <AlertDialog>
            <AlertDialogTrigger>
              <Switch checked={enabled} className="shadow-none" />
            </AlertDialogTrigger>
            <AlertDialogContent className="!p-0">
              <DisableDialog name={name} enabled={enabled} onChange={onChange} />
            </AlertDialogContent>
          </AlertDialog>
          {dialog}
        </div>
      </div>
    </div>
  )
}
