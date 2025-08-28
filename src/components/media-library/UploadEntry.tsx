import { Badge } from '@/components/shadcn/ui/badge'
import { motion } from 'framer-motion'
import { Check, LoaderCircle, X } from 'lucide-react'
import React from 'react'

export type UploadEntryType = {
  file: File
  loading: boolean
  error: boolean
}

export const UploadEntry = ({ entry }: { entry: UploadEntryType }) => {
  return (
    <motion.div
      className="w-full py-2 pr-4 pl-2 flex flex-row items-center justify-between rounded-md border border-brease-gray-5 shadow-brease-sm"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Badge variant={'builderListCardPage'}>{entry.file.name}</Badge>
      {entry.error ? (
        <X className="h-4 w-4 stroke-brease-error" />
      ) : entry.loading ? (
        <LoaderCircle className="h-4 w-4 stroke-brease-primary animate-spin" />
      ) : (
        <Check className="h-4 w-4 stroke-brease-success" />
      )}
    </motion.div>
  )
}
