import { memo } from 'react'
import { calculateGPA } from '../utils/gradeUtils.js'

export const SemesterCards = memo(function SemesterCards({ semesters, activeSemesterId, onSelect, onAdd, onRemove }) {
  const isVertical = semesters.length <= 4

  return (
    <div className="mx-auto min-h-[200px] w-full max-w-4xl px-4 pt-4 sm:px-6">
      <div
        className={`no-scrollbar -mx-4 w-full px-4 pb-4 pt-2 sm:mx-0 sm:px-0 flex gap-2.5 ${isVertical ? 'flex-col' : 'flex-row snap-x snap-mandatory overflow-x-auto'}`}
      >
        {semesters.map((sem) => {
          const { gpa, totalCredits } = calculateGPA(sem.rows)
          const isActive = sem.id === activeSemesterId
          const gpaDisplay = gpa === null ? '—' : gpa.toFixed(2)
          const creditsStr = totalCredits > 0 ? (totalCredits % 1 === 0 ? String(totalCredits) : totalCredits.toFixed(1)) : null

          return (
            <div key={sem.id} className={`group relative shrink-0 ${isVertical ? 'w-full' : 'min-w-[140px] snap-start'}`}>
              <button
                type="button"
                onClick={() => onSelect(sem.id)}
                className={`flex w-full justify-between will-change-transform rounded-[20px] border px-4 py-3 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                  isActive
                    ? 'border-violet-300 bg-violet-50/80 shadow-[0_4px_24px_-8px_rgba(139,92,246,0.22)] dark:border-violet-500/40 dark:bg-violet-500/10 dark:shadow-[0_4px_28px_-10px_rgba(139,92,246,0.15)]'
                    : 'hover-violet-accent border-zinc-200/80 bg-white hover:scale-[1.01] dark:border-zinc-700/80 dark:bg-zinc-900'
                } ${isVertical ? 'flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0' : 'flex-col items-start gap-2 h-full'}`}
                aria-label={`Open ${sem.name}`}
              >
                <span className={`truncate text-[12px] font-semibold uppercase tracking-wide ${isVertical ? 'pr-2 w-full sm:w-auto' : 'pr-6 w-full'} ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500 transition-colors group-hover:text-violet-500 dark:text-zinc-400 dark:group-hover:text-violet-300'}`}>
                  {sem.name}
                </span>

                <div className={`flex items-center justify-between mt-1 sm:mt-0 ${isVertical ? 'w-full sm:w-auto sm:ml-auto' : 'w-full'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className={`tabular-nums text-lg sm:text-[20px] font-bold tracking-tight leading-none ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-50'}`}>
                        {gpaDisplay}
                      </span>
                      <span className={`mt-1 text-[9px] font-medium uppercase leading-none ${isActive ? 'text-violet-500 dark:text-violet-400/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        GPA
                      </span>
                    </div>

                    {creditsStr && (
                      <>
                        <div className={`w-[1px] h-6 ${isActive ? 'bg-violet-200/80 dark:bg-violet-500/30' : 'bg-zinc-200/80 dark:bg-zinc-700/80'}`} aria-hidden="true" />
                        <div className="flex flex-col items-start sm:items-end">
                          <span className={`tabular-nums text-sm sm:text-[20px] font-bold tracking-tight leading-none ${isActive ? 'text-violet-900 dark:text-violet-100' : 'text-zinc-900 dark:text-zinc-50'}`}>
                            {creditsStr}
                          </span>
                          <span className={`mt-1 text-[9px] font-medium uppercase leading-none ${isActive ? 'text-violet-500 dark:text-violet-400/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                            Credits
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Delete button — matches Row.jsx style exactly */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(sem.id)
                    }}
                    title="Delete semester"
                    className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 opacity-60 transition-all duration-200 hover:scale-[1.03] hover:bg-red-50 hover:text-red-600 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 active:scale-[0.97] dark:text-zinc-500 dark:hover:bg-red-950/60 dark:hover:text-red-400"
                    aria-label={`Delete ${sem.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </button>
            </div>
          )
        })}

        <button
          type="button"
          onClick={onAdd}
          className={`group flex shrink-0 will-change-transform items-center justify-center rounded-[20px] border border-dashed border-zinc-200/80 bg-zinc-50/50 p-3 text-zinc-500 transition-all duration-200 hover:scale-[1.03] hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 active:scale-[0.97] dark:border-zinc-700/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:hover:text-violet-300 dark:focus-visible:ring-offset-zinc-950 ${isVertical ? 'w-full flex-row gap-3 min-h-[64px]' : 'min-w-[120px] flex-col snap-start'}`}
          aria-label="Add new semester"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200/50 transition-transform group-hover:scale-110 group-hover:ring-violet-200 dark:bg-zinc-800 dark:ring-zinc-700 dark:group-hover:ring-violet-500/40">
            <PlusIcon className="h-3.5 w-3.5" />
          </div>
          <span className={`text-[11px] font-semibold uppercase tracking-wide flex-none ${isVertical ? '' : 'mt-2'}`}>Add Semester</span>
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

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}
