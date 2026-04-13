import { useState, useEffect } from 'react'

export function CgpaPredictor({ totalCredits, totalGradePoints, onTargetCgpaChange }) {
  const [targetCGPA, setTargetCGPA] = useState(9.00)
  const [nextCredits, setNextCredits] = useState(20)
  const [isOpen, setIsOpen] = useState(totalCredits === 0)

  useEffect(() => {
    setIsOpen(totalCredits === 0)
  }, [totalCredits])

  useEffect(() => {
    if (typeof onTargetCgpaChange !== 'function') return
    if (totalCredits === 0) {
      onTargetCgpaChange(null)
      return
    }
    onTargetCgpaChange(Number(targetCGPA.toFixed(2)))
  }, [targetCGPA, totalCredits, onTargetCgpaChange])

  if (totalCredits === 0) {
    return (
      <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)} className="group mt-6 min-h-[140px] sm:mt-8 rounded-3xl border border-zinc-200/80 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-colors dark:border-zinc-700/80 dark:bg-zinc-900 opacity-60">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5 sm:p-6 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 rounded-3xl">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Future Goal Predictor
            </h3>
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">Beta</span>
          </div>
          <ChevronIcon className="h-4 w-4 text-zinc-400 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="border-t border-zinc-100 px-5 pb-5 pt-4 dark:border-zinc-800 sm:px-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 py-1">Add semesters first to unlock predictions.</p>
        </div>
      </details>
    )
  }

  const requiredGPA = (targetCGPA * (totalCredits + nextCredits) - totalGradePoints) / nextCredits

  let content = null
  if (requiredGPA > 10) {
    content = <p className="font-bold text-red-500 dark:text-red-400 text-lg">Not possible 😬</p>
  } else if (requiredGPA <= 0) {
    content = <p className="font-bold text-emerald-500 dark:text-emerald-400 text-lg">Already achieved 🎉</p>
  } else {
    let diffLabel = ''
    let diffColor = ''
    let diffMsg = ''
    
    if (requiredGPA >= 9.8) {
      diffLabel = 'Very Tough 🔴'
      diffColor = 'text-red-500 dark:text-red-400'
      diffMsg = 'You’ll need near perfect grades 😬'
    } else if (requiredGPA >= 9.2) {
      diffLabel = 'Moderate 🟠'
      diffColor = 'text-orange-500 dark:text-orange-400'
      diffMsg = 'A bit of a grind, but doable 💪'
    } else {
      diffLabel = 'Easy 🟢'
      diffColor = 'text-green-500 dark:text-green-400'
      diffMsg = "You're in a comfortable zone 😌"
    }

    content = (
      <div className="flex flex-col items-center gap-1">
        <p className="text-[15px] font-medium text-zinc-700 dark:text-zinc-200">
          You need a GPA of <span className="text-xl font-bold text-violet-600 dark:text-violet-400">{requiredGPA.toFixed(2)}</span> next semester
        </p>
        <div className={`mt-2 font-bold text-sm ${diffColor}`}>{diffLabel}</div>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{diffMsg}</p>
      </div>
    )
  }

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)} className="group mt-6 min-h-[220px] sm:mt-8 rounded-3xl border border-zinc-200/80 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-colors dark:border-zinc-700/80 dark:bg-zinc-900">
      <summary className="flex cursor-pointer list-none flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 rounded-3xl relative">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Future Goal Predictor
              </h3>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">Interactive</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Simulate required GPA loads</p>
          </div>
          <ChevronIcon className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-open:rotate-180" />
        </div>
      </summary>
      
      <div className="border-t border-zinc-100 px-5 pb-6 pt-4 dark:border-zinc-800 sm:px-6 space-y-6">
        <div>
          <div className="mb-2 flex justify-between items-center text-sm">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">Target CGPA</label>
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold tabular-nums text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {Number(targetCGPA).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="10"
            step="0.01"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600 transition-colors"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between items-center text-sm">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">Next Semester Credits</label>
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold tabular-nums text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {nextCredits}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={nextCredits}
            onChange={(e) => setNextCredits(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600 transition-colors"
          />
        </div>

        <div className="rounded-2xl border border-violet-100/50 bg-violet-50/50 p-4 text-center shadow-inner dark:border-violet-500/10 dark:bg-violet-500/5">
          {content}
        </div>
      </div>
    </details>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
