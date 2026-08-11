import Reveal from './Reveal'

export default function SectionHeading({ index, title, subtitle, align = 'left' }) {
  return (
    <Reveal
      className={`mb-14 ${align === 'center' ? 'text-center mx-auto' : ''}`}
    >
      <div
        className={`flex items-center gap-3 text-cyan font-mono text-sm tracking-[0.3em] uppercase mb-4 ${
          align === 'center' ? 'justify-center' : ''
        }`}
        style={{ color: 'var(--color-cyan)' }}
      >
        <span className="h-px w-8 bg-current opacity-60" />
        {index}
        <span className="h-px w-8 bg-current opacity-60" />
      </div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[var(--color-muted)] max-w-xl text-lg leading-relaxed" style={align === 'center' ? { marginInline: 'auto' } : undefined}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
