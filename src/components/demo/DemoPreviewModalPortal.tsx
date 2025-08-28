'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DemoPreviewModal } from './DemoPreviewModal'

interface Props {
  changes: any
  onClose: () => void
  onApprove: () => void
}

export function DemoPreviewModalPortal({ changes, onClose, onApprove }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <DemoPreviewModal 
      changes={changes}
      onClose={onClose}
      onApprove={onApprove}
    />,
    document.body
  )
}