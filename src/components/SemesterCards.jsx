import { memo } from 'react'
import { calculateGPA } from '../utils/gradeUtils.js'

export const SemesterCards = memo(function SemesterCards({ semesters, activeSemesterId, onSelect, onAdd, onRemove }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
      <div className="no-scrollbar -mx-4 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-2 sm:mx-0 sm:px-0">
        {semesters.map((sem) => {
          const { gpa, totalCredits } = calculateGPA(sem.rows)
          const isActive = sem.id === activeSemesterId
          const gpaDisplay = gpa === null ? '—' : gpa.toFixed(2)
          const creditsStr = totalCredits > 0 ? (totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1)) : null

          return (
            <div key={sem.id} className="group relative min-w-[160px] shrink-0 snap-start">
              <button
                onClick={() => onSelect(sem.id)}
                className={`flex h-full w-full flex-col items-start rounded-3xl border p-4 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                  isActive
                    ? 'border-violet-300 bg-violet-50/80 shadow-[0_4px_24px_-8px_rgba(139,92,246,0.22)] dark:border-violet-500/40 dark:bg-violet-500/10 dark:shadow-[0_4px_28px_-10px_rgba(139,92,246,0.15)]'
                    : 'hover-violet-accent border-zinc-200/80 bg-white dark:border-zinc-700/80 dark:bg-zinc-900'
                }`}
              >
                <span className={`text-[11px] font-semibold uppercase tracking-wide pr-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500 transition-colors group-hover:text-violet-500 dark:text-zinc-400 dark:group-hover:text-violet-300'}`}>
                  {sem.name}
                </span>

                <div className="mt-2.5 flex w-full items-center gap-5">
                  <div className="flex flex-col">
                    <span className={`tabular-nums text-2xl font-bold tracking-tight leading-none ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-50'}`}>
                      {gpaDisplay}
                    </span>
                    <span className={`mt-1.5 text-[10px] font-medium uppercase leading-none ${isActive ? 'text-violet-500 dark:text-violet-400/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      GPA
                    </span>
                  </div>
                  
                  {creditsStr && (
                    <>
                      <div className={`w-[1px] h-8 bg-zinc-200/80 dark:bg-zinc-700/80 ${isActive ? 'bg-violet-200/80 dark:bg-violet-500/30' : ''}`} aria-hidden="true" />
                      <div className="flex flex-col">
                        <span className={`tabular-nums text-2xl font-bold tracking-tight leading-none ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-50'}`}>
                          {creditsStr}
                        </span>
                        <span className={`mt-1.5 text-[10px] font-medium uppercase leading-none ${isActive ? 'text-violet-500 dark:text-violet-400/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                          Credits
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(sem.id)
                }}
                title="Delete semester"
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 shadow-sm ring-1 ring-red-200/50 transition-all hover:bg-red-100 hover:text-red-700 hover:scale-110 group-hover:opacity-100 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900/30 dark:hover:bg-red-900/40 dark:hover:text-red-300"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          )
        })}

        <button
          onClick={onAdd}
          className="group flex min-w-[120px] shrink-0 snap-start flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/50 p-4 text-zinc-500 transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 dark:border-zinc-700/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:hover:text-violet-300 dark:focus-visible:ring-offset-zinc-950"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200/50 transition-transform group-hover:scale-110 group-hover:ring-violet-200 dark:bg-zinc-800 dark:ring-zinc-700 dark:group-hover:ring-violet-500/40">
            <PlusIcon className="h-4 w-4" />
          </div>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide">Add Semester</span>
        </button>
      </div>
    </div>
  )
})

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}
