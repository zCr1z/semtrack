import { useCallback, useLayoutEffect, useRef } from 'react'
import { Row } from './Row.jsx'

/**
 * @param {{
 *   rows: { id: string; subject: string; credits: string; grade: string }[]
 *   newRowIds: Set<string>
 *   onRowChange: (id: string, patch: Partial<{ subject: string; credits: string; grade: string }>) => void
 *   onRowRemove: (id: string) => void
 *   onAddRow: () => void
 *   focusNewRowIdRef: React.MutableRefObject<string | null>
 * }} props
 */
export function Table({ rows, newRowIds, onRowChange, onRowRemove, onAddRow, focusNewRowIdRef }) {
  const cellRefs = useRef(new Map())

  const setCellRef = useCallback((rowId, field, el) => {
    const key = `${rowId}:${field}`
    if (el) cellRefs.current.set(key, el)
    else cellRefs.current.delete(key)
  }, [])

  const focusCell = useCallback((rowId, field) => {
    const el = cellRefs.current.get(`${rowId}:${field}`)
    if (!el) return
    el.focus()
    if (field !== 'grade' && typeof el.select === 'function') el.select()
  }, [])

  useLayoutEffect(() => {
    const id = focusNewRowIdRef.current
    if (!id || !rows.some((r) => r.id === id)) return
    const subject = cellRefs.current.get(`${id}:subject`)
    if (subject) {
      subject.focus()
      subject.select()
    }
    focusNewRowIdRef.current = null
  }, [rows, focusNewRowIdRef])

  return (
    <div className="animate-card-in overflow-x-auto rounded-2xl border border-zinc-200/75 bg-white shadow-[0_4px_24px_-8px_rgba(139,92,246,0.05),0_4px_24px_-8px_rgba(0,0,0,0.06)] dark:border-zinc-700/80 dark:bg-zinc-900 dark:shadow-[0_4px_28px_-10px_rgba(0,0,0,0.5)] sm:overflow-hidden sm:rounded-3xl">
      <div className="min-w-[34rem] sm:min-w-0">
        <div
          className="hidden grid-cols-[minmax(0,1.25fr)_5.25rem_5.75rem_3.5rem_4.25rem_2.75rem] gap-x-4 gap-y-0 border-b border-zinc-100/90 bg-gradient-to-r from-violet-50/35 via-zinc-50/98 to-zinc-50/95 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500 dark:border-zinc-800 dark:from-zinc-900/95 dark:via-zinc-900/95 dark:to-zinc-900/95 dark:text-zinc-400 sm:grid"
          role="rowgroup"
        >
          <div role="columnheader" className="pl-0.5">
            Subject
          </div>
          <div role="columnheader" className="text-center">
            Creds
          </div>
          <div role="columnheader" className="text-center">
            Grade
          </div>
          <div role="columnheader" className="text-center">
            GP
          </div>
          <div role="columnheader" className="text-center">
            Total
          </div>
          <div role="columnheader" className="text-center" aria-hidden>
            {' '}
          </div>
        </div>

        <div role="rowgroup">
          {rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-base font-medium text-zinc-700 dark:text-zinc-200">Start by adding a subject</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Press <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-800">Enter</kbd> to begin, or use the button below
              </p>
            </div>
          ) : (
            rows.map((row, index) => (
              <Row
                key={row.id}
                row={row}
                onChange={onRowChange}
                onRemove={onRowRemove}
                isNew={newRowIds.has(row.id)}
                setCellRef={(field, el) => setCellRef(row.id, field, el)}
                focusCellAt={focusCell}
                nextRowId={rows[index + 1]?.id ?? null}
                onAddRow={onAddRow}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
