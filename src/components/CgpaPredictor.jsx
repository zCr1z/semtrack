import { useState } from 'react'

export function CgpaPredictor({ totalCredits, totalGradePoints, currentCgpa }) {
  const [targetStr, setTargetStr] = useState('')
  const targetCGPA = parseFloat(targetStr)

  if (totalCredits === 0) {
    return null
  }

  let content = null

  if (isNaN(targetCGPA) || targetCGPA <= 0 || targetCGPA > 10) {
    content = <p className="text-sm text-zinc-500 dark:text-zinc-400 py-1">Enter a target CGPA (up to 10.0) to mathematically project your required future grades.</p>
  } else if (targetCGPA <= (currentCgpa || 0)) {
    content = <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 py-1">You have already reached this CGPA! 🎉</p>
  } else if (targetCGPA >= 10 && (currentCgpa || 0) < 10) {
    content = <p className="text-sm font-medium text-red-500 dark:text-red-400 py-1">Target is mathematically impossible.</p>
  } else {
    // x = (targetCGPA * currentCredits - currentGradePoints) / (10 - targetCGPA)
    const exactCredits = (targetCGPA * totalCredits - totalGradePoints) / (10 - targetCGPA)
    const requiredCredits = Math.ceil(exactCredits * 10) / 10 
    
    // Approximate into subjects
    const subjects4 = Math.ceil(exactCredits / 4)
    const subjects3 = Math.ceil(exactCredits / 3)

    content = (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          To reach <span className="font-bold text-violet-600 dark:text-violet-400">{targetCGPA.toFixed(2)} CGPA</span> (best-case scenario):
        </p>
        <div className="rounded-2xl border border-violet-100/50 bg-violet-50/50 p-4 dark:border-violet-500/10 dark:bg-violet-500/5">
          <p className="mb-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            You need approximately <span className="font-bold tabular-nums text-violet-700 dark:text-violet-300">{requiredCredits}</span> future credits, assuming all are scored at grade S (10 points).
          </p>
          <ul className="ml-5 list-disc space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>~<span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{subjects4}</span> subjects (4 credits)</li>
            <li>~<span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{subjects3}</span> subjects (3 credits)</li>
          </ul>
          {exactCredits > 30 && (
            <p className="mt-4 text-[13px] font-medium leading-relaxed text-amber-600 dark:text-amber-500">
              ⚠️ This may require multiple semesters of top performance.
            </p>
          )}
        </div>
        <p className="mt-0.5 text-[11px] italic text-zinc-400 dark:text-zinc-500">
          * Assumes future grades are S (10 points)
        </p>
      </div>
    )
  }

  return (
    <div className="card hover-violet-accent mt-8 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-colors dark:border-zinc-700/80 dark:bg-zinc-900 sm:mt-10 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Future Goal Predictor
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">
              Beta
            </span>
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Calculate minimum effort required to hit a specific threshold.</p>
        </div>
        <div className="w-full sm:w-28">
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="Target"
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            className="apply-focus-glow input-hover-violet w-full rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-3 py-2 text-center text-sm font-medium tabular-nums text-zinc-900 shadow-inner shadow-zinc-900/[0.02] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-zinc-400 focus:bg-white dark:border-zinc-700/90 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>
      <div className="pt-2">
        {content}
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-600">
          Predictions are approximate and based on current performance.
        </p>
      </div>
    </div>
  )
}
