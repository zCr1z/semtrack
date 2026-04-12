import { memo, useCallback, useRef, useState } from 'react'
import {
  calculateRowTotal,
  creditsHasError,
  creditsIsValidPositive,
  getGradePoint,
  GRADES,
  sanitizeCreditsInput,
} from '../utils/gradeUtils.js'

const inputBase =
  'apply-focus-glow input-hover-violet w-full min-h-[44px] rounded-xl border px-3 py-2.5 text-[15px] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out sm:min-h-0 sm:py-2 sm:text-sm ' +
  'border-zinc-200/90 bg-zinc-50/80 text-zinc-900 shadow-inner shadow-zinc-900/[0.02] placeholder:text-zinc-400 ' +
  'hover:bg-white focus:bg-white ' +
  'dark:border-zinc-700/90 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 ' +
  'dark:hover:bg-zinc-950/80 '

const creditsValidRing =
  'border-emerald-300/70 bg-emerald-50/35 dark:border-emerald-600/50 dark:bg-emerald-950/25'

const creditsWarnRing =
  'border-amber-200/90 bg-amber-50/40 text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/20 dark:text-amber-100'

/**
 * @param {React.KeyboardEvent} e
 * @param {string} current
 */
function creditsKeyDownFilter(e, current) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const nav = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
  if (nav.includes(e.key)) return
  if (e.key === '.' && !current.includes('.')) return
  if (/^\d$/.test(e.key)) return
  e.preventDefault()
}

/**
 * @param {{
 *   row: { id: string; subject: string; credits: string; grade: string }
 *   onChange: (id: string, patch: Partial<{ subject: string; credits: string; grade: string }>) => void
 *   onRemove: (id: string) => void
 *   isNew?: boolean
 *   setCellRef: (field: 'subject' | 'credits' | 'grade', el: HTMLElement | null) => void
 *   focusCellAt: (rowId: string, field: 'subject' | 'credits' | 'grade') => void
 *   nextRowId: string | null
 *   onAddRow: () => void
 * }} props
 */
function _Row({
  row,
  onChange,
  onRemove,
  isNew,
  setCellRef,
  focusCellAt,
  nextRowId,
  onAddRow,
}) {
  const [exiting, setExiting] = useState(false)
  const composing = useRef(false)
  const gp = getGradePoint(row.grade)
  const creditsNum = parseFloat(String(row.credits).trim())
  const rowTotal =
    Number.isFinite(creditsNum) && creditsNum > 0 ? calculateRowTotal(creditsNum, row.grade) : 0
  const creditError = creditsHasError(row.credits)
  const creditOk = creditsIsValidPositive(row.credits)

  const handleDelete = useCallback(() => {
    setExiting(true)
  }, [])

  const handleAnimEnd = useCallback(
    (e) => {
      const names = String(e.animationName || '')
        .split(',')
        .map((n) => n.trim())
      if (!names.includes('row-exit')) return
      onRemove(row.id)
    },
    [onRemove, row.id],
  )

  const onSubjectEnter = useCallback(
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey || composing.current) return
      e.preventDefault()
      focusCellAt(row.id, 'credits')
    },
    [focusCellAt, row.id],
  )

  const onCreditsEnter = useCallback(
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey || composing.current) return
      e.preventDefault()
      focusCellAt(row.id, 'grade')
    },
    [focusCellAt, row.id],
  )

  const onGradeEnter = useCallback(
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey) return
      e.preventDefault()
      if (nextRowId) focusCellAt(nextRowId, 'subject')
      else onAddRow()
    },
    [focusCellAt, nextRowId, onAddRow],
  )

  const onEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      e.currentTarget.blur()
    }
  }, [])

  const creditsClass = creditError
    ? `${inputBase} text-center font-mono tabular-nums ${creditsWarnRing}`
    : creditOk
      ? `${inputBase} text-center font-mono tabular-nums ${creditsValidRing}`
      : `${inputBase} text-center font-mono tabular-nums`

  return (
    <div
      role="row"
      onAnimationEnd={handleAnimEnd}
      className={`group relative z-0 grid grid-cols-[minmax(0,1fr)_4.5rem_4.25rem_2.75rem_3.25rem_2.25rem] items-center gap-x-3 gap-y-2 border-b border-zinc-100/90 px-3 py-2.5 transition-[background-color,box-shadow] duration-200 ease-out will-change-[background-color,box-shadow] sm:grid-cols-[minmax(0,1.25fr)_5.25rem_5.75rem_3.5rem_4.25rem_2.75rem] sm:gap-x-4 sm:px-5 sm:py-3 dark:border-zinc-800/80 has-[:focus-within]:z-[2] has-[:focus-within]:bg-violet-50/50 has-[:focus-within]:shadow-[inset_3px_0_0_0_rgba(139,92,246,0.38)] dark:has-[:focus-within]:bg-violet-950/35 dark:has-[:focus-within]:shadow-[inset_3px_0_0_0_rgba(167,139,250,0.35)] ${
        exiting
          ? 'animate-row-exit pointer-events-none'
          : isNew
            ? 'animate-row-enter'
            : 'table-row-violet-hover hover:z-[1]'
      }`}
    >
      <div role="cell" className="min-w-0">
        <label className="sr-only" htmlFor={`subject-${row.id}`}>
          Subject name
        </label>
        <input
          ref={(el) => setCellRef('subject', el)}
          id={`subject-${row.id}`}
          type="text"
          placeholder="Subject name"
          value={row.subject}
          onChange={(e) => onChange(row.id, { subject: e.target.value })}
          onKeyDown={(e) => {
            onEscape(e)
            onSubjectEnter(e)
          }}
          onCompositionStart={() => {
            composing.current = true
          }}
          onCompositionEnd={() => {
            composing.current = false
          }}
          onFocus={(e) => e.target.select()}
          className={inputBase}
        />
      </div>

      <div role="cell" className="min-w-0">
        <label className="sr-only" htmlFor={`credits-${row.id}`}>
          Credits
        </label>
        <input
          ref={(el) => setCellRef('credits', el)}
          id={`credits-${row.id}`}
          type="text"
          inputMode="decimal"
          placeholder="—"
          value={row.credits}
          onChange={(e) => onChange(row.id, { credits: sanitizeCreditsInput(e.target.value) })}
          onPaste={(e) => {
            e.preventDefault()
            const t = sanitizeCreditsInput(e.clipboardData.getData('text'))
            onChange(row.id, { credits: t })
          }}
          onKeyDown={(e) => {
            creditsKeyDownFilter(e, row.credits)
            onEscape(e)
            onCreditsEnter(e)
          }}
          onFocus={(e) => e.target.select()}
          className={creditsClass}
          aria-invalid={creditError}
        />
      </div>

      <div role="cell" className="min-w-0">
        <label className="sr-only" htmlFor={`grade-${row.id}`}>
          Grade
        </label>
        <div className="relative">
          <select
            ref={(el) => setCellRef('grade', el)}
            id={`grade-${row.id}`}
            value={row.grade}
            onChange={(e) => onChange(row.id, { grade: e.target.value })}
            onKeyDown={(e) => {
              onEscape(e)
              onGradeEnter(e)
            }}
            className={
              inputBase +
              ' cursor-pointer appearance-none py-2.5 pl-3 pr-9 text-center font-medium tabular-nums sm:py-2'
            }
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            aria-hidden
          >
            <ChevronIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div
        role="cell"
        className="text-center font-mono text-[13px] tabular-nums text-zinc-600 transition-colors duration-200 group-hover:text-zinc-700 dark:text-zinc-300 dark:group-hover:text-zinc-200 sm:text-sm"
      >
        {gp}
      </div>

      <div
        role="cell"
        className="text-center font-mono text-[13px] font-semibold tabular-nums text-zinc-900 transition-colors duration-200 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white sm:text-sm"
      >
        {rowTotal % 1 === 0 ? rowTotal || '—' : rowTotal.toFixed(2)}
      </div>

      <div role="cell" className="flex justify-end pr-0.5">
        <button
          type="button"
          onClick={handleDelete}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-400 opacity-80 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 active:scale-95 dark:text-zinc-500 dark:hover:bg-red-950/60 dark:hover:text-red-400 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`Remove ${row.subject || 'subject'}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export const Row = memo(_Row, (prev, next) => {
  return (
    prev.row === next.row &&
    prev.isNew === next.isNew &&
    prev.nextRowId === next.nextRowId &&
    prev.onChange === next.onChange &&
    prev.onRemove === next.onRemove &&
    prev.setCellRef === next.setCellRef &&
    prev.focusCellAt === next.focusCellAt &&
    prev.onAddRow === next.onAddRow
  )
})

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
