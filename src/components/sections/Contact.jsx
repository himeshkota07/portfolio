import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import Reveal from '../Reveal'
import { profile } from '../../data/resume'

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/5 px-4 py-1.5 font-mono text-xs tracking-wide mb-7"
            style={{ color: 'var(--color-cyan)' }}
          >
            06 — Contact
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[var(--color-text)] leading-tight">
            Let's build something <span className="text-gradient">intelligent</span>.
          </h2>
          <p className="mt-5 text-[var(--color-muted)] text-lg">
            Open to AI/ML engineering roles, internships, and interesting collaborations. Reach out — I reply fast.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-mono text-sm font-medium bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
            >
              <FiMail /> {profile.email}
              <FiArrowUpRight />
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-mono text-sm font-medium border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-cyan)]/50 hover:text-[var(--color-cyan)] transition-colors"
            >
              <FiPhone /> {profile.phone}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-cyan)] transition-colors text-sm font-mono"
            >
              <FiGithub /> {profile.githubHandle}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-cyan)] transition-colors text-sm font-mono"
            >
              <FiLinkedin /> {profile.linkedinHandle}
            </a>
          </div>
        </Reveal>

        <div className="mt-24 pt-8 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[var(--color-faint)] text-center sm:text-left">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Built with React, Three.js &amp; Framer Motion.</span>
        </div>
      </div>
    </section>
  )
}
