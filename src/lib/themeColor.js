// Keeps the browser bar (the theme-color tag) the same colour as the page background, which is
// the --bg token of the theme in use. Does nothing if the token cannot be read.
export function syncThemeColor() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
}
