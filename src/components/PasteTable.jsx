import { useState, useRef, useEffect } from 'react'
import { parseTableText } from '../utils/parseTable.js'

export function PasteTable({ onParsed }) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [message, setMessage] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
    setMessage(null)
  }

  const handleParse = () => {
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'Please paste some table data first.' })
      return
    }

    const result = parseTableText(text)
    if (result.parsedCount === 0) {
      setMessage({ type: 'error', text: 'No valid subjects detected. Please check your input.' })
      return
    }

    onParsed(result)
    
    let msg = `Parsed ${result.parsedCount} subjects`
    if (result.skippedCount > 0) {
      msg += ` (${result.skippedCount} skipped)`
    }
    setMessage({ type: 'success', text: msg })
  }

  const handleClear = () => {
    setText('')
    setMessage(null)
    textareaRef.current?.focus()
  }

  return (
    <div className="card mt-4 overflow-hidden rounded-2xl border border-zinc-200/75 bg-white shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900 sm:rounded-3xl">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between bg-zinc-50/50 px-5 py-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-violet-50/50 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/80 sm:px-6"
      >
        <div className="flex items-center gap-2">
          <ClipboardIcon className="h-4 w-4 text-violet-500/80 dark:text-violet-400/80" />
          Paste from Portal (VTOP/BATN)
        </div>
        <ChevronIcon className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border-t border-zinc-100 p-5 dark:border-zinc-800 sm:p-6">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your Result - Grade View table here..."
            className="apply-focus-glow input-hover-violet h-32 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-[13px] text-zinc-800 placeholder:text-zinc-400 transition-[border-color,background-color] duration-200 ease-out focus:bg-white focus:outline-none dark:border-zinc-700 dark:placeholder:text-zinc-600 sm:text-sm"
          />

          {message && (
            <div
              className={`mt-3 rounded-xl px-4 py-2.5 text-[13px] font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleParse}
              className="button-gradient hover-violet-accent relative flex-1 overflow-hidden rounded-xl border border-transparent bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-violet-500 dark:hover:bg-violet-600 dark:focus-visible:ring-offset-zinc-900"
            >
              <span className="relative z-[1]">Parse Table Data</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-900"
            >
              Clear Input
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Note: Some non-credit courses may be included. Please remove them manually if needed.
          </p>
        </div>
      )}
    </div>
  )
}

function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
