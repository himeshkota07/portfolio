import { FiCode, FiCpu, FiDatabase, FiCloud } from 'react-icons/fi'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { skills } from '../../data/resume'
import { skillIcons } from '../../data/skillIcons'

const ICONS = {
  Languages: FiCode,
  'ML / AI': FiCpu,
  Data: FiDatabase,
  'Cloud / Tools': FiCloud,
}

const allSkills = Object.values(skills).flat()

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02" title="Skills" subtitle="The stack I reach for when turning data into decisions." />

        <div className="grid sm:grid-cols-2 gap-5">
          {Object.entries(skills).map(([category, list], i) => {
            const Icon = ICONS[category] ?? FiCode
            return (
              <Reveal key={category} delay={i * 0.08}>
                <div className="group rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-6 h-full transition-colors hover:border-[var(--color-cyan)]/40">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-line)] text-lg group-hover:border-[var(--color-cyan)]/50 transition-colors"
                      style={{ color: 'var(--color-cyan)' }}
                    >
                      <Icon />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-[var(--color-text)]">{category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((skill) => {
                      const entry = skillIcons[skill]
                      const SkillIcon = entry?.icon
                      return (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 text-[var(--color-text)]/85 hover:bg-white/10 transition-colors"
                        >
                          {SkillIcon && (
                            <SkillIcon className="text-sm shrink-0" style={{ color: entry.color }} />
                          )}
                          {skill}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      <Reveal delay={0.2} className="mt-16 overflow-hidden border-y border-[var(--color-line)] py-4">
        <div className="flex w-max gap-10 animate-marquee">
          {[...allSkills, ...allSkills].map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="font-display text-2xl font-semibold text-[var(--color-text)]/15 whitespace-nowrap"
            >
              {skill} <span style={{ color: 'var(--color-violet)', opacity: 0.4 }}>/</span>
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
