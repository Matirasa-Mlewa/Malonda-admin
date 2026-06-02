import { useState, useCallback } from 'react'

export function useConfirm() {
  const [dialog, setDialog] = useState(null)

  const confirm = useCallback(({ title, body, confirmLabel = 'Confirm', variant = 'danger', onConfirm }) => {
    setDialog({ title, body, confirmLabel, variant, onConfirm })
  }, [])

  const close = useCallback(() => setDialog(null), [])

  const handleConfirm = useCallback(() => {
    dialog?.onConfirm?.()
    setDialog(null)
  }, [dialog])

  return { dialog, confirm, close, handleConfirm }
}
