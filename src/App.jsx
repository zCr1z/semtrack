import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Footer from './components/Footer.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))

export default function App() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      console.log('Vercel Analytics Loaded')
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      <Footer />
      {import.meta.env.PROD ? <Analytics /> : null}
    </>
  )
}
