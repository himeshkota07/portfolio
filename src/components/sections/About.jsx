import { FiCpu, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { profile, softSkills, languages, hobbies, education } from '../../data/resume'

export default function About() {
  const current = education[0]

  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" title="About" subtitle="A quick look at who I am and how I work." />

        <div className="grid md:grid-cols-5 gap-10">
          <Reveal className="md:col-span-3" delay={0.05}>
            <p className="text-lg leading-relaxed text-[var(--color-text)]/90">{profile.summary}</p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-5">
              <FiCpu className="text-2xl shrink-0" style={{ color: 'var(--color-cyan)' }} />
              <div>
                <div className="font-display font-semibold text-[var(--color-text)]">{current.degree}</div>
                <div className="text-sm text-[var(--color-muted)] mt-0.5">
                  {current.school} · {current.period} · {current.detail}
                </div>
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                [FiMapPin, profile.location],
                [FiMail, profile.email],
                [FiPhone, profile.phone],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                  <Icon style={{ color: 'var(--color-violet)' }} />
                  {text}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="md:col-span-2 flex flex-col gap-6" delay={0.15}>
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-4">
                How I work
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-text)]/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-4">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span key={l.name} className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 text-[var(--color-text)]/85">
                    {l.name} <span className="text-[var(--color-faint)]">· {l.level}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-4">
                Off the clock
              </h3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((h) => (
                  <span key={h} className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 text-[var(--color-text)]/85">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
