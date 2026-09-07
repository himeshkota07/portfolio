import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi'
import useActiveSection from '../hooks/useActiveSection'
import { profile } from '../data/resume'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

const IDS = LINKS.map((l) => l.id)

export default function Navbar() {
  const active = useActiveSection(IDS)
  const [open, setOpen] = useState(false)

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/70 backdrop-blur-xl px-5 py-3 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
          <button
            onClick={() => go('home')}
            className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]"
          >
            HK<span style={{ color: 'var(--color-cyan)' }}>.</span>
          </button>

          <ul className="hidden md:flex items-center gap-1 font-mono text-[13px]">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    active === link.id
                      ? 'text-[var(--color-text)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--color-panel)', border: '1px solid var(--color-line)' }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-[var(--color-muted)] hover:text-[var(--color-cyan)] transition-colors text-lg"
            >
              <FiGithub />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--color-muted)] hover:text-[var(--color-cyan)] transition-colors text-lg"
            >
              <FiLinkedin />
            </a>
            <button
              onClick={() => go('contact')}
              className="font-mono text-xs uppercase tracking-wider rounded-lg px-4 py-2 border border-[var(--color-cyan)]/40 text-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10 transition-colors"
            >
              Let's talk
            </button>
          </div>

          <button
            className="md:hidden text-xl text-[var(--color-text)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/95 backdrop-blur-xl p-4"
            >
              <ul className="flex flex-col gap-1 font-mono text-sm">
                {LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => go(link.id)}
                      className={`w-full text-left px-3 py-3 rounded-lg ${
                        active === link.id ? 'text-[var(--color-cyan)] bg-white/5' : 'text-[var(--color-muted)]'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 mt-2 px-3 pb-1">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-[var(--color-muted)] text-lg"
                >
                  <FiGithub />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-[var(--color-muted)] text-lg"
                >
                  <FiLinkedin />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
