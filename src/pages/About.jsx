import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-svh bg-[var(--color-surface)] font-sans dark:bg-zinc-950">
      {/* Simple nav bar */}
      <div className="border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="SemTrackify" className="h-7 w-7" />
            <span className="text-base font-semibold text-zinc-900 group-hover:text-violet-700 transition-colors dark:text-white dark:group-hover:text-violet-400">
              SemTrackify
            </span>
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          About SemTrackify
        </h1>
        <p className="mt-3 text-sm font-medium text-violet-600 dark:text-violet-400">
          Know your numbers. Control your future.
        </p>

        <div className="mt-10 space-y-8 text-zinc-600 dark:text-zinc-400">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">What is SemTrackify?</h2>
            <p className="leading-relaxed">
              SemTrackify is a student-focused CGPA tracker designed to help you monitor academic performance
              across multiple semesters with precision. Enter your subjects, credits, and grades — and
              instantly see your cumulative GPA and overall grade points, all saved locally on your device.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Key Features</h2>
            <ul className="space-y-2.5">
              {[
                'Multi-semester tracking with individual GPA per semester',
                'Real-time CGPA calculation using credit-weighted average',
                'Future Goal Predictor — find the exact credits needed to hit a target CGPA',
                'Paste Table — bulk import your marksheet directly from a table',
                'Offline-ready PWA — works without internet after first load',
                'All data saved locally — no account, no server, fully private',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Built for Students</h2>
            <p className="leading-relaxed">
              SemTrackify was built to solve a simple problem — keeping track of academic performance
              without spreadsheets or manual calculations. It runs entirely in your browser, respects your
              privacy, and works offline as a Progressive Web App you can install on any device.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            Open App
          </Link>
        </div>
      </main>
    </div>
  )
}
