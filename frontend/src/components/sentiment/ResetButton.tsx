'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

interface ResetButtonProps {
  onConfirm: () => Promise<void>
}

export function ResetButton({ onConfirm }: ResetButtonProps) {
  const [isResetting, setIsResetting] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleConfirm() {
    setIsResetting(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Reset all data">
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Reset all data</DialogTitle>
          <DialogDescription>
            This will permanently delete all feedback data. This action cannot be undone.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose
              render={
                <Button variant="outline" disabled={isResetting}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              disabled={isResetting}
              onClick={handleConfirm}
            >
              {isResetting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                'Reset'
              )}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  )
}
