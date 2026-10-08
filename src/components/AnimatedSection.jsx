import { m, useInView } from 'framer-motion'
import { useRef } from 'react'

// The one entrance the page uses below the hero: a section's heading and body come in together,
// once, short and small. Wrap the section's container in it.
export function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  )
}
