import tablet from '../assets/nook/casa.webp'
import phone from '../assets/nook/telemovel.webp'

// Real captures of the Nook, copied from its repository. Width and height are the files' own
// pixels; the caption and the description of each one live in the translations, under the same key.
export const NOOK_SHOTS = {
  tablet: { src: tablet, width: 1280, height: 800 },
  phone: { src: phone, width: 390, height: 844 },
}

export const NOOK_STACK = ['Home Assistant', 'Python', 'JavaScript', 'CSS', 'Docker Compose']

// The two addresses come from the build (see .env). Anything that is not a web address counts as
// unset, so the page never shows a button that leads nowhere.
const webAddress = (value) => (/^https?:\/\//.test(value ?? '') ? value : '')

export const nookLinks = () => ({
  demo: webAddress(import.meta.env.VITE_DEMO_URL),
  repo: webAddress(import.meta.env.VITE_NOOK_REPO_URL),
})
