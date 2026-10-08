import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Highlights from './components/Highlights'
import Footer from './components/Footer'

function App() {
  const { t } = useTranslation()

  return (
    // domAnimation loads only the animation features we use; "user" makes every Framer Motion
    // animation follow the visitor's "reduce motion" setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-accent focus:text-accent-fg focus:font-semibold focus:text-sm"
          >
            {t('nav.skipToContent')}
          </a>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Education />
            <Highlights />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
