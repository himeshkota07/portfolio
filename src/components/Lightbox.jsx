import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-12 right-0 flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Close <FiX className="text-lg" />
            </button>
            <img
              src={item.image}
              alt={item.title}
              className="w-full rounded-2xl border border-[var(--color-line)] shadow-2xl"
            />
            <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
              {item.title} <span className="text-[var(--color-faint)]">— {item.issuer}</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
