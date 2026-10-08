/**
 * The zone label for Portugal, always correct for today's date: "UTC+1 · WEST" in summer time,
 * "UTC+0 · WET" in winter. The browser knows the rules (and when they change), so nothing needs
 * editing twice a year. Falls back to the city name if the browser cannot resolve the zone.
 */
const NAMES = { 0: 'WET', 60: 'WEST' } // Western European (Summer) Time

export function lisbonZoneLabel(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', timeZoneName: 'longOffset' })
      .formatToParts(date)
    const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? '' // "GMT+01:00", or "GMT" at +0
    const m = /^GMT(?:([+-])(\d{2}):(\d{2}))?$/.exec(raw)
    if (!m) return 'Europe/Lisbon'
    const minutes = m[1] ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0
    const hours = minutes / 60
    const offset = `UTC${hours >= 0 ? '+' : '-'}${Math.abs(hours)}`
    return NAMES[minutes] ? `${offset} · ${NAMES[minutes]}` : offset
  } catch {
    return 'Europe/Lisbon'
  }
}
