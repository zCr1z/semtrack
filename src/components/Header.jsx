import { AnimatedNumber } from './AnimatedNumber.jsx'
import { useHeaderCompact } from '../hooks/useHeaderCompact.js'

/**
 * @param {{
 *   gpaDisplay: string
 *   totalCredits: number
 *   totalGradePoints: number
 *   darkMode: boolean
 *   onToggleDark: () => void
 * }} props
 */
export function Header({ gpaDisplay, totalCredits, totalGradePoints, darkMode, onToggleDark }) {
  const { compact, reducedMotion } = useHeaderCompact()
  const creditsStr = totalCredits.toFixed(totalCredits % 1 ? 1 : 0)
  const pointsStr =
    totalGradePoints % 1 === 0
      ? String(Math.round(totalGradePoints))
      : totalGradePoints.toFixed(2)

  return (
    <header
      className={`header-root sticky top-0 z-40 ${reducedMotion ? 'header-root--reduce-motion' : ''}`}
      data-compact={compact ? 'true' : 'false'}
    >
      <div className="header-inner mx-auto max-w-4xl px-4 sm:px-6">
        <div className="hdr-title-row flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="SemTrack logo"
              className="hdr-logo h-8 w-8 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h1 className="hdr-h1 font-sans font-semibold tracking-tight text-zinc-950 dark:text-white">
                SemTrackify
              </h1>
              <p className="header-tagline max-w-md text-left text-[13px] leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400">
                Know your numbers. Control your future.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleDark}
            className="hdr-theme-btn flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200/90 bg-white text-zinc-600 shadow-sm transition-colors duration-200 hover:border-violet-300/80 hover:bg-violet-50/60 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.96] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-violet-500/50 dark:hover:bg-violet-950/50 dark:hover:text-violet-200 dark:focus-visible:ring-violet-400/45 dark:focus-visible:ring-offset-zinc-950"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="hdr-metrics-grid grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2">
          <div className="hdr-gpa-card relative overflow-hidden border border-violet-200/55 bg-gradient-to-br from-violet-50/50 via-white to-zinc-50/95 ring-1 ring-violet-300/25 dark:border-violet-500/25 dark:from-violet-950/50 dark:via-zinc-900 dark:to-zinc-950 dark:ring-violet-400/15 sm:col-span-2 sm:row-span-2 sm:flex sm:flex-col sm:justify-center">
            <div
              className="pointer-events-none absolute inset-0 bg-violet-50/30 dark:hidden"
              aria-hidden
            />
            <div
              className="hdr-gpa-orb pointer-events-none absolute -right-16 -top-16 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/20"
              aria-hidden
            />
            <div className="hdr-gpa-inner-transform relative flex h-full flex-col justify-center sm:block">
              <p className="hdr-gpa-label relative text-left font-semibold uppercase tracking-[0.14em] text-violet-700/90 dark:text-violet-300/90">
                CGPA
              </p>
              <p className="hdr-gpa-value relative mt-1 font-bold tracking-tight text-zinc-950 tabular-nums dark:text-white sm:mt-2">
                <AnimatedNumber value={gpaDisplay} variant="hero" />
              </p>
            </div>
          </div>

          <StatCard label="Total credits" value={creditsStr} />
          <StatCard label="Total grade points" value={pointsStr} subtitle="Σ (credits × points)" />
        </div>
      </div>
    </header>
  )
}

/**
 * @param {{ label: string; value: string; subtitle?: string }} props
 */
function StatCard({ label, value, subtitle }) {
  return (
    <div className="card hdr-stat-card rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-colors duration-200 hover:border-violet-200/50 hover:shadow-[0_4px_20px_-10px_rgba(139,92,246,0.08)] dark:border-zinc-700/90 dark:bg-zinc-900 dark:shadow-none dark:hover:border-zinc-600 dark:hover:bg-zinc-900/95 dark:hover:shadow-none">
      <p className="hdr-stat-label text-left font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="hdr-stat-value text-left font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
        <AnimatedNumber value={value} />
      </p>
      {subtitle ? (
        <p className="hdr-stat-sub text-left text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

function MoonIcon() {
  return (
    <svg className="block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  )
}
