import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const TYPING_MS = 80 // per letter, while typing
const DELETING_MS = 40 // per letter, while deleting
const HOLD_MS = 2000 // a finished role stays on screen
const NEXT_ROLE_MS = 300 // empty pause before the next role starts

/**
 * Types and deletes each role in turn, forever, while the line is on screen.
 *
 * - The first role is already written on load, so nobody reads half a word.
 * - The timers stop while the line is off screen and pick up again when it comes back.
 * - Lives in its own component so a keystroke re-renders only this line, not the whole hero.
 * - State only changes inside the timer callback, never synchronously in the effect body.
 * - Screen readers get the full list of roles as plain text; the animation and cursor are
 *   hidden from them, so they never hear half a word.
 * - With "reduce motion" on, the first role is shown still and nothing moves.
 * - The parent gives it `key={language}`, so a language change restarts it from the first
 *   role (no reset logic needed) and the two languages may have different numbers of roles.
 */
export default function Typewriter({ roles }) {
  const reducedMotion = usePrefersReducedMotion()
  const [{ index, text, deleting }, setStep] = useState({ index: 0, text: roles[0] ?? '', deleting: false })
  const lineRef = useRef(null)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const line = lineRef.current
    if (!line || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(line)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !onScreen || roles.length === 0) return

    const word = roles[index % roles.length]
    let delay
    let next
    if (!deleting && text.length < word.length) {
      delay = TYPING_MS
      next = { index, text: word.slice(0, text.length + 1), deleting: false }
    } else if (!deleting) {
      delay = HOLD_MS
      next = { index, text, deleting: true }
    } else if (text.length > 0) {
      delay = DELETING_MS
      next = { index, text: word.slice(0, text.length - 1), deleting: true }
    } else {
      delay = NEXT_ROLE_MS
      next = { index: (index + 1) % roles.length, text: '', deleting: false }
    }

    const timer = setTimeout(() => setStep(next), delay)
    return () => clearTimeout(timer)
  }, [index, text, deleting, roles, reducedMotion, onScreen])

  return (
    <span ref={lineRef}>
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">
        {reducedMotion ? roles[0] : text}
        {!reducedMotion && <span className="animate-pulse">▮</span>}
      </span>
    </span>
  )
}
