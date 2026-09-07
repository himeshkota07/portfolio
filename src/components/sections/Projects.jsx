import { FiExternalLink, FiGithub, FiStar } from 'react-icons/fi'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import TiltCard from '../TiltCard'
import { projects } from '../../data/resume'

function ProjectCard({ project, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <TiltCard className="h-full">
        <div className="flex flex-col h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/60 p-7 hover:border-[var(--color-cyan)]/40 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-muted)]">
              {project.period}
            </span>
            {project.featured && (
              <span
                className="flex items-center gap-1 font-mono text-xs px-3 py-1.5 rounded-full"
                style={{ color: 'var(--color-cyan)', background: 'rgba(34,211,238,0.08)' }}
              >
                <FiStar /> Featured
              </span>
            )}
          </div>

          <h3 className="font-display font-semibold text-2xl text-[var(--color-text)]">{project.title}</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-violet)' }}>{project.tag}</p>

          <p className="mt-4 text-[var(--color-text)]/75 leading-relaxed">{project.description}</p>

          {project.highlights.length > 0 && (
            <ul className="mt-4 space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[var(--color-muted)]">
                  <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: 'var(--color-cyan)' }} />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-text)]/70">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs font-medium bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
              >
                <FiExternalLink /> Live Demo
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs font-medium border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-cyan)]/50 hover:text-[var(--color-cyan)] transition-colors"
            >
              <FiGithub /> Code
            </a>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  )
}

const sortedProjects = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04" title="Projects" subtitle="Selected builds — from hackathon wins to systems shipped solo." />

        <div className="grid sm:grid-cols-2 gap-6" style={{ perspective: 1200 }}>
          {sortedProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} delay={(i % 2) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
