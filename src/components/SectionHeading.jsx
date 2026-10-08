// "01. Title ———" heading shared by every section. `id` is what the section's
// aria-labelledby points to.
export default function SectionHeading({ id, num, title }) {
  return (
    <div className="flex items-center gap-3 mb-12">
      <span className="font-mono text-sm" style={{ color: 'var(--accent)' }}>{num}</span>
      <h2 id={id} className="text-3xl font-bold text-strong">{title}</h2>
      <div className="flex-1 h-px bg-rule ml-4" />
    </div>
  )
}
