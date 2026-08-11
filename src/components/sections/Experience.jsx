import { FiBriefcase } from 'react-icons/fi'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { experience } from '../../data/resume'

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03" title="Experience" subtitle="Where I've applied ML outside the classroom." />

        <div className="relative pl-8 md:pl-12">
          <div className="absolute left-2.5 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-cyan)] via-[var(--color-violet)] to-transparent" />

          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.1} className="relative mb-10 last:mb-0">
              <span
                className="absolute -left-[27px] md:-left-[35px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2"
                style={{ borderColor: 'var(--color-cyan)', background: 'var(--color-bg)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-cyan)' }} />
              </span>

              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-7 hover:border-[var(--color-cyan)]/30 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-line)]"
                      style={{ color: 'var(--color-violet)' }}
                    >
                      <FiBriefcase />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl text-[var(--color-text)]">{job.role}</h3>
                      <p className="text-sm text-[var(--color-muted)]">
                        {job.company} · {job.location}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-muted)] whitespace-nowrap">
                    {job.period}
                  </span>
                </div>

                <ul className="mt-5 space-y-3">
                  {job.bullets.map((b, idx) => (
                    <li key={idx} className="flex gap-3 text-[var(--color-text)]/80 leading-relaxed">
                      <span className="mt-2.5 h-1 w-1 rounded-full shrink-0" style={{ background: 'var(--color-cyan)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
