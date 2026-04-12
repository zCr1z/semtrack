import { useEffect, useState } from 'react'

const SCROLL_COMPACT_PX = 80

/**
 * Binary compact header when scrolled past threshold — updates only when value changes (no rAF).
 * @returns {{ compact: boolean; reducedMotion: boolean }}
 */
export function useHeaderCompact() {
  const [compact, setCompact] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onMq)

    const onScroll = () => {
      const scrollY = window.scrollY
      setCompact((prev) => {
        // Use a larger buffer (>110px) to prevent scroll anchor fighting.
        // When header shrinks by ~106px, the scrollY drops by ~106px.
        // It must NOT cross the expansion threshold!
        if (!prev && scrollY > 150) return true
        if (prev && scrollY < 10) return false
        return prev
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      mq.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return { compact, reducedMotion }
}
