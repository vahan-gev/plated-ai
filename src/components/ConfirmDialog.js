'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const btnBase =
  'inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        role="presentation"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        data-app-modal-backdrop
        onClick={onCancel}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`${btnBase} border border-border bg-white text-muted-foreground hover:border-stone-300 hover:text-foreground`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`${btnBase} font-semibold text-white disabled:opacity-60 ${
              danger
                ? 'bg-[#D24545] hover:bg-[#b83a3a]'
                : 'bg-[#215E61] hover:bg-[#1d5458]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                <span>Please wait…</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
