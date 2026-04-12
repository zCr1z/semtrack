import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '../components/Header.jsx'
import { Table } from '../components/Table.jsx'
import { SplashScreen } from '../components/SplashScreen.jsx'
import { calculateGPA } from '../utils/gradeUtils.js'

const SemesterCards = lazy(() => import('../components/SemesterCards.jsx').then(m => ({ default: m.SemesterCards })))
const PasteTable = lazy(() => import('../components/PasteTable.jsx').then(m => ({ default: m.PasteTable })))
const CgpaPredictor = lazy(() => import('../components/CgpaPredictor.jsx').then(m => ({ default: m.CgpaPredictor })))

const STORAGE_KEY = 'cgpa-calc-v2'
const OLD_STORAGE_KEY = 'cgpa-calc-v1'

function createRow() {
  return { id: crypto.randomUUID(), subject: '', credits: '', grade: 'S' }
}

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    let isLegacy = false
    
    if (!raw) {
      raw = localStorage.getItem(OLD_STORAGE_KEY)
      isLegacy = true
    }
    
    if (!raw) return null
    
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null

    let semesters = Array.isArray(data.semesters) ? data.semesters : []
    let activeId = data.activeSemesterId

    if (isLegacy && semesters.length === 0 && Array.isArray(data.rows)) {
      const id = crypto.randomUUID()
      semesters = [{ id, name: data.semester || 'Semester 1', rows: data.rows }]
      activeId = id
    } else if (semesters.length === 0 && Array.isArray(data.rows)) {
      const id = crypto.randomUUID()
      semesters = [{ id, name: data.semester || 'Semester 1', rows: data.rows }]
      activeId = id
    }

    const normalizedSems = semesters.map(s => ({
      id: typeof s.id === 'string' ? s.id : crypto.randomUUID(),
      name: typeof s.name === 'string' ? s.name : 'Unnamed Semester',
      rows: Array.isArray(s.rows) ? s.rows.filter(r => r && typeof r.id === 'string').map(r => ({
        id: r.id,
        subject: typeof r.subject === 'string' ? r.subject : (typeof r.name === 'string' ? r.name : ''),
        credits: r.credits != null ? String(r.credits) : '',
        grade: typeof r.grade === 'string' ? r.grade : 'S',
        code: typeof r.code === 'string' ? r.code : undefined,
      })) : []
    }))

    return {
      semesters: normalizedSems,
      activeSemesterId: typeof activeId === 'string' ? activeId : (normalizedSems[0]?.id ?? null),
      darkMode: data.darkMode === true,
    }
  } catch {
    return null
  }
}

function getSemesterRank(name) {
  const match = name.match(/(Fall|Winter|Spring|Summer)?\s*Semester\s*(\d{4})/i)
  if (!match) return null
  const season = match[1] ? match[1].toLowerCase() : ''
  const year = parseInt(match[2], 10)
  
  let seasonRank = 0
  if (season === 'fall') seasonRank = 1
  else if (season === 'winter') seasonRank = 2
  else if (season === 'spring') seasonRank = 3
  else if (season === 'summer') seasonRank = 4

  return { year, seasonRank }
}

export default function Home() {
  const initial = useMemo(() => loadState(), [])
  const [semesters, setSemesters] = useState(() => initial?.semesters ?? [])
  const [activeSemesterId, setActiveSemesterId] = useState(() => initial?.activeSemesterId ?? null)
  const [darkMode, setDarkMode] = useState(() => initial?.darkMode ?? false)
  const [showSplash, setShowSplash] = useState(true)
  const [newRowIds, setNewRowIds] = useState(() => new Set())
  const newRowTimers = useRef(new Map())
  const focusNewRowIdRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const saveTimerRef = useRef(null)
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const payload = JSON.stringify({ semesters, activeSemesterId, darkMode })
      localStorage.setItem(STORAGE_KEY, payload)
    }, 400)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [semesters, activeSemesterId, darkMode])

  const sortedSemesters = useMemo(() => {
    return [...semesters].sort((a, b) => {
      const rankA = getSemesterRank(a.name)
      const rankB = getSemesterRank(b.name)
      if (!rankA && !rankB) return 0
      if (!rankA) return 1
      if (!rankB) return -1
      if (rankA.year !== rankB.year) return rankA.year - rankB.year
      return rankA.seasonRank - rankB.seasonRank
    })
  }, [semesters])

  const allRows = useMemo(() => semesters.flatMap(s => s.rows), [semesters])
  const { gpa, totalCredits, totalGradePoints } = useMemo(() => calculateGPA(allRows), [allRows])
  const gpaDisplay = gpa === null ? '—' : gpa.toFixed(2)

  const handleRowChange = useCallback((id, patch) => {
    setSemesters((prev) => prev.map(sem => {
      if (!sem.rows.some((r) => r.id === id)) return sem
      return { ...sem, rows: sem.rows.map(r => r.id === id ? { ...r, ...patch } : r) }
    }))
  }, [])

  const handleRowRemove = useCallback((id) => {
    setSemesters((prev) => prev.map(sem => {
      if (!sem.rows.some((r) => r.id === id)) return sem
      return { ...sem, rows: sem.rows.filter(r => r.id !== id) }
    }))
    setNewRowIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    const t = newRowTimers.current.get(id)
    if (t) window.clearTimeout(t)
    newRowTimers.current.delete(id)
  }, [])

  const addRow = useCallback(() => {
    if (!activeSemesterId) return
    const row = createRow()
    focusNewRowIdRef.current = row.id
    setSemesters((prev) => prev.map(sem => {
      if (sem.id !== activeSemesterId) return sem
      return { ...sem, rows: [...sem.rows, row] }
    }))
    setNewRowIds((prev) => new Set(prev).add(row.id))
    const t = window.setTimeout(() => {
      setNewRowIds((prev) => {
        const next = new Set(prev)
        next.delete(row.id)
        return next
      })
      newRowTimers.current.delete(row.id)
    }, 400)
    newRowTimers.current.set(row.id, t)
  }, [activeSemesterId])

  const addSemester = useCallback(() => {
    const id = crypto.randomUUID()
    const nums = semesters.map(s => {
      const match = s.name.match(/^Semester\s+(\d+)$/i)
      return match ? parseInt(match[1], 10) : 0
    })
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0
    const newSem = { id, name: `Semester ${maxNum + 1}`, rows: [] }
    setSemesters((prev) => [...prev, newSem])
    setActiveSemesterId(id)
  }, [semesters])

  const handleSemesterRemove = useCallback((id) => {
    if (!window.confirm('Delete this semester?')) return
    setSemesters(prev => {
      const next = prev.filter(sem => sem.id !== id)
      if (activeSemesterId === id) {
        const nextActive = next.length > 0 ? next[next.length - 1].id : null
        setActiveSemesterId(nextActive)
      }
      return next
    })
  }, [activeSemesterId])

  const handleParsedTable = useCallback((result) => {    
    setSemesters((prev) => {
      let targetSem = prev.find(s => s.id === activeSemesterId)
      let isNew = false
      let nextSems = [...prev]
      let targetId = activeSemesterId

      if (!targetSem || targetSem.rows.length > 0) {
        targetId = crypto.randomUUID()
        const semName = result.semester || `Semester ${prev.length + 1}`
        targetSem = { id: targetId, name: semName, rows: [] }
        nextSems.push(targetSem)
        isNew = true
      } else if (result.semester) {
        targetSem = { ...targetSem, name: result.semester }
      }

      const nextRows = [...targetSem.rows]
      const newIds = []
      
      for (const pr of result.parsedRows) {
        if (pr.code && nextRows.some((r) => r.code === pr.code)) continue
        const id = crypto.randomUUID()
        nextRows.push({ id, subject: pr.subject, credits: pr.credits, grade: pr.grade, code: pr.code })
        newIds.push(id)
      }

      targetSem = { ...targetSem, rows: nextRows }
      if (isNew) {
        nextSems[nextSems.length - 1] = targetSem
      } else {
        nextSems = nextSems.map(s => s.id === targetId ? targetSem : s)
      }

      setTimeout(() => setActiveSemesterId(targetId), 0)

      if (newIds.length > 0) {
        setNewRowIds((prevIds) => {
          const nextIds = new Set(prevIds)
          newIds.forEach((id) => nextIds.add(id))
          return nextIds
        })
        newIds.forEach((id) => {
          const t = window.setTimeout(() => {
            setNewRowIds((p) => {
              const nx = new Set(p)
              nx.delete(id)
              return nx
            })
            newRowTimers.current.delete(id)
          }, 400)
          newRowTimers.current.set(id, t)
        })
      }
      return nextSems
    })
  }, [activeSemesterId])

  const activeSemester = useMemo(() => 
    semesters.find(s => s.id === activeSemesterId) ?? null
  , [semesters, activeSemesterId])

  useEffect(() => {
    if (!activeSemester || activeSemester.rows.length > 0) return
    const onKey = (e) => {
      if (e.key !== 'Enter' || e.defaultPrevented) return
      const t = e.target
      if (t instanceof HTMLElement) {
        if (t.closest('input, textarea, select, button, a[href], [contenteditable="true"]')) return
      }
      addRow()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSemester, addRow])

  const toggleDark = useCallback(() => {
    setDarkMode((d) => !d)
  }, [])

  return (
    <div className="min-h-svh font-sans">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Header
        gpaDisplay={gpaDisplay}
        totalCredits={totalCredits}
        totalGradePoints={totalGradePoints}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />

      <Suspense fallback={null}>
        <SemesterCards 
          semesters={sortedSemesters}
          activeSemesterId={activeSemesterId}
          onSelect={setActiveSemesterId}
          onAdd={addSemester}
          onRemove={handleSemesterRemove}
        />
      </Suspense>

      <main className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
        {!activeSemester ? (
          <div className="rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/50 py-16 px-6 text-center shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/40">
             <p className="text-zinc-500 font-medium dark:text-zinc-400">Start by adding a semester</p>
          </div>
        ) : (
          <>
            <Table
              rows={activeSemester.rows}
              newRowIds={newRowIds}
              onRowChange={handleRowChange}
              onRowRemove={handleRowRemove}
              onAddRow={addRow}
              focusNewRowIdRef={focusNewRowIdRef}
            />

            <Suspense fallback={null}>
              <CgpaPredictor 
                totalCredits={totalCredits}
                totalGradePoints={totalGradePoints}
                currentCgpa={gpa}
              />
            </Suspense>

            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                onClick={addRow}
                className="button-gradient hover-violet-accent group relative flex w-full items-center justify-center overflow-hidden gap-2.5 rounded-2xl border border-dashed border-violet-200/65 bg-gradient-to-b from-white via-violet-50/[0.22] to-violet-50/40 py-4 text-sm font-semibold text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(139,92,246,0.04)] transition-all duration-200 ease-out hover:bg-gradient-to-b hover:from-violet-50/50 hover:via-violet-50/70 hover:to-violet-100/45 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.992] dark:border-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-200 dark:shadow-none dark:[background-image:none] dark:hover:bg-violet-950/35 dark:hover:text-violet-100 dark:hover:[background-image:none] dark:focus-visible:ring-violet-400/45 dark:focus-visible:ring-offset-zinc-950 sm:rounded-3xl sm:py-[1.125rem]"
              >
                <span className="relative z-[1] flex items-center gap-2.5">
                  <PlusIcon className="h-5 w-5 text-violet-600 transition-transform duration-200 group-hover:scale-105 dark:text-violet-400" />
                  Add subject
                </span>
              </button>

              <Suspense fallback={null}>
                <PasteTable onParsed={handleParsedTable} />
              </Suspense>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
