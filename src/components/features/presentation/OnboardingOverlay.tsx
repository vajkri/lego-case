'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui'

const STORAGE_KEY = 'lego-onboarding-dismissed'
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function isDismissed(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    return Date.now() - parseInt(stored, 10) < TTL_MS
  } catch {
    return false
  }
}

/* ─── LEGO key cap — looks like a 1×1 flat tile with brick depth ─── */
function KeyCap({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center font-display font-bold text-lego-dark rounded-lg select-none"
      style={{
        minWidth: wide ? 80 : 48,
        height: 48,
        padding: '0 14px',
        background: '#F0EEE8',
        borderBottom: '4px solid #D4D4D8',
        fontSize: 16,
        letterSpacing: wide ? 1 : 0,
      }}
    >
      {children}
    </span>
  )
}

/* ─── One row: key(s) + description ─── */
function KeyRow({
  keys,
  label,
}: {
  keys: { label: string; wide?: boolean }[]
  label: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2 shrink-0" style={{ minWidth: 112 }}>
        {keys.map((k) => (
          <KeyCap key={k.label} wide={k.wide}>
            {k.label}
          </KeyCap>
        ))}
      </div>
      <span className="font-body text-base text-lego-grey">{label}</span>
    </div>
  )
}

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false)
  const [dontShow, setDontShow] = useState(true)

  useEffect(() => {
    if (!isDismissed()) setVisible(true)
  }, [])

  const handleClose = useCallback(() => {
    if (dontShow) {
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString())
      } catch {
        /* localStorage full or blocked — degrade gracefully */
      }
    }
    setVisible(false)
  }, [dontShow])

  /* Dismiss on any navigation key — the best onboarding is the action itself */
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', ' ', 'Escape'].includes(e.key)) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, handleClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onboarding-backdrop"
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: 'rgba(44, 44, 44, 0.5)' }}
          /* Click backdrop to dismiss */
          onClick={handleClose}
        >
          {/* Card — stop propagation so clicking card doesn't dismiss */}
          <motion.div
            className="rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 440,
              width: '92%',
              background: 'white',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 6px 0 0 #D4D4D8',
            }}
          >
            {/* ── Red stud-pattern header ── */}
            <div className="bg-lego-red stud-pattern px-6 py-4">
              <motion.h2
                className="font-display font-bold text-white text-xl"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                Navigate with your keyboard
              </motion.h2>
            </div>

            {/* ── Key guide ── */}
            <div className="px-6 pt-6 pb-2 space-y-4">
              <KeyRow
                keys={[{ label: '←' }, { label: '→' }]}
                label="Move between stops"
              />
              <KeyRow
                keys={[{ label: 'Space', wide: true }]}
                label="Advance to next"
              />
              <KeyRow
                keys={[{ label: 'Esc', wide: true }]}
                label="Return to map"
              />
            </div>

            {/* ── Footer: checkbox + button ── */}
            <div className="px-6 pb-6 pt-4 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                  className="w-[18px] h-[18px] rounded accent-lego-red cursor-pointer"
                />
                <span className="font-body text-sm text-lego-grey group-hover:text-lego-dark transition-colors">
                  Don&apos;t show this again
                </span>
              </label>
              <Button
                variant="yellow"
                size="label"
                onClick={handleClose}
                className="w-full justify-center"
              >
                Got it!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
