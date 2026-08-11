import { motion } from 'framer-motion'
import { FiArrowDown, FiDownload, FiMail } from 'react-icons/fi'
import { profile } from '../../data/resume'
import profilePhoto from '../../assets/profile-cropped.jpg'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center px-6 pt-32 pb-20"
    >
      <div className="mx-auto max-w-6xl w-full grid md:grid-cols-[1.3fr_0.9fr] gap-14 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/5 px-4 py-1.5 font-mono text-xs tracking-wide text-[var(--color-muted)] mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-slow absolute inline-flex h-full w-full rounded-full bg-[var(--color-cyan)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-cyan)]" />
            </span>
            Open to AI/ML engineering roles
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display font-bold leading-[1.03] text-5xl sm:text-6xl lg:text-7xl text-[var(--color-text)]"
          >
            {profile.displayName}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-gradient font-display font-semibold text-2xl sm:text-3xl mt-4"
          >
            {profile.role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-[var(--color-muted)] text-lg leading-relaxed"
          >
            {profile.tagline} Currently building ML-powered lead intelligence
            systems and shipping national-hackathon-winning AI products.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-mono text-sm font-medium bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-mono text-sm font-medium border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-cyan)]/50 hover:text-[var(--color-cyan)] transition-colors"
            >
              <FiDownload /> Resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-mono text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <FiMail /> {profile.email}
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-14 grid grid-cols-3 gap-6 max-w-md">
            {[
              ['9.16', 'CGPA'],
              ['1st', 'Place, Agentica-2.0'],
              ['2', 'National Hackathons'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-[var(--color-text)]">{value}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1 leading-snug">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative mx-auto hidden md:block"
        >
          <div className="relative w-72 h-72 lg:w-80 lg:h-80">
            <div
              className="absolute inset-0 rounded-[2.5rem] animate-float"
              style={{
                background: 'linear-gradient(140deg, rgba(34,211,238,0.18), rgba(167,139,250,0.14))',
                border: '1px solid var(--color-line)',
                backdropFilter: 'blur(6px)',
              }}
            />
            <div className="absolute inset-6 rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-panel)]/60 flex items-center justify-center overflow-hidden">
              <img
                src={profilePhoto}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-4 rounded-[3rem] border border-[var(--color-cyan)]/20 pointer-events-none" />
            <div
              className="absolute -bottom-5 -right-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur-md px-4 py-3 font-mono text-xs text-[var(--color-muted)] shadow-xl"
            >
              <span style={{ color: 'var(--color-cyan)' }}>&gt;</span> status: shipping_ai_systems
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-cyan)] transition-colors"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <FiArrowDown />
        </motion.span>
      </motion.button>
    </section>
  )
}
