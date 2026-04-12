import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200/60 bg-white/60 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="SemTrackify" className="h-6 w-6" />
              <span className="text-base font-semibold text-zinc-900 dark:text-white">SemTrackify</span>
            </div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              Know your numbers. Control your future.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400">
                  About Us
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Contact</h3>
            <a
              href="mailto:christhomasbinoj10@gmail.com"
              className="text-sm text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
            >
              christhomasbinoj10@gmail.com
            </a>
          </div>

        </div>

        <div className="mt-10 border-t border-zinc-100 pt-6 dark:border-zinc-800/60">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} SemTrackify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
