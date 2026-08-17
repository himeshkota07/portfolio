import { Fragment, useState } from 'react'
import { FiAward, FiBookOpen, FiCheckCircle, FiZoomIn } from 'react-icons/fi'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import Lightbox from '../Lightbox'
import { achievements, certifications, education } from '../../data/resume'

function ColumnHeader({ icon: Icon, title, delay }) {
  return (
    <Reveal delay={delay} className="flex items-center gap-3 mb-1">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-line)]"
        style={{ color: 'var(--color-cyan)' }}
      >
        <Icon />
      </div>
      <h3 className="font-display font-semibold text-lg text-[var(--color-text)]">{title}</h3>
    </Reveal>
  )
}

const cardCls =
  'h-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-5 hover:border-[var(--color-cyan)]/30 transition-colors'

const certCardCls =
  'h-full flex flex-col rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 overflow-hidden hover:border-[var(--color-cyan)]/30 transition-colors'

const rowCount = Math.max(achievements.length, education.length)

function AchievementCard({ a }) {
  return (
    <div className={cardCls}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-[var(--color-text)] leading-snug">{a.title}</h4>
        <span className="font-mono text-xs text-[var(--color-faint)] whitespace-nowrap">{a.year}</span>
      </div>
      <p className="text-xs mt-1" style={{ color: 'var(--color-violet)' }}>{a.org}</p>
      <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">{a.description}</p>
    </div>
  )
}

function EducationCard({ e }) {
  return (
    <div className={cardCls}>
      <h4 className="font-medium text-[var(--color-text)] leading-snug">{e.degree}</h4>
      <p className="text-xs mt-1" style={{ color: 'var(--color-violet)' }}>{e.school}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-[var(--color-muted)]">{e.detail}</span>
        <span className="font-mono text-xs text-[var(--color-faint)]">{e.period}</span>
      </div>
    </div>
  )
}

export default function Credentials() {
  const [activeCert, setActiveCert] = useState(null)

  return (
    <section id="credentials" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05" title="Credentials" subtitle="Achievements, certifications, and education." />

        {/* Mobile: each group stays together as its own header + cards. */}
        <div className="md:hidden flex flex-col gap-10">
          <div>
            <ColumnHeader icon={FiAward} title="Achievements" delay={0} />
            <div className="flex flex-col gap-4 mt-4">
              {achievements.map((a, i) => (
                <Reveal key={a.title} delay={0.05 * i}>
                  <AchievementCard a={a} />
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <ColumnHeader icon={FiBookOpen} title="Education" delay={0} />
            <div className="flex flex-col gap-4 mt-4">
              {education.map((e, i) => (
                <Reveal key={e.degree} delay={0.05 * i}>
                  <EducationCard e={e} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: row-paired 2-column grid so matching tiles share height. */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-8 gap-y-4">
          <ColumnHeader icon={FiAward} title="Achievements" delay={0} />
          <ColumnHeader icon={FiBookOpen} title="Education" delay={0.1} />

          {Array.from({ length: rowCount }).map((_, i) => {
            const a = achievements[i]
            const e = education[i]
            return (
              <Fragment key={i}>
                {a ? (
                  <Reveal key={`a-${a.title}`} delay={0.05 * i}>
                    <AchievementCard a={a} />
                  </Reveal>
                ) : (
                  <div key={`a-empty-${i}`} />
                )}

                {e ? (
                  <Reveal key={`e-${e.degree}`} delay={0.05 * i + 0.1}>
                    <EducationCard e={e} />
                  </Reveal>
                ) : (
                  <div key={`e-empty-${i}`} />
                )}
              </Fragment>
            )
          })}
        </div>

        <Reveal delay={0.2} className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-line)]"
              style={{ color: 'var(--color-cyan)' }}
            >
              <FiCheckCircle />
            </div>
            <h3 className="font-display font-semibold text-lg text-[var(--color-text)]">
              Certifications <span className="text-[var(--color-faint)] font-mono text-sm">({certifications.length})</span>
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((c) => (
              <div key={c.title} className={certCardCls}>
                {c.image && (
                  <button
                    onClick={() => setActiveCert(c)}
                    className="group relative block w-full aspect-[4/3] overflow-hidden border-b border-[var(--color-line)]"
                    aria-label={`View ${c.title} certificate`}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors">
                      <span
                        className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all"
                        style={{ background: 'var(--color-bg)', color: 'var(--color-cyan)' }}
                      >
                        <FiZoomIn /> View certificate
                      </span>
                    </div>
                  </button>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-[var(--color-text)] leading-snug">{c.title}</h4>
                    {c.year && <span className="font-mono text-xs text-[var(--color-faint)] whitespace-nowrap shrink-0">{c.year}</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-violet)' }}>{c.issuer}</p>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Lightbox item={activeCert} onClose={() => setActiveCert(null)} />
    </section>
  )
}
