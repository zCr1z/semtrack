import { forwardRef } from 'react'

/**
 * Off-screen 900px share card using html2canvas logic.
 * Strict HTML/CSS subset — entirely avoids oklch colors.
 */
export const ShareCard = forwardRef(function ShareCard(
  { cgpa, totalCredits, totalGradePoints, semesters, targetCgpa = null },
  ref
) {
  const gradeRank = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 }
  const semData = (semesters || []).map((sem, index) => {
    let credits = 0
    let points = 0
    for (const row of sem.rows ?? []) {
      const c = parseFloat(row.credits)
      if (!Number.isFinite(c) || c <= 0) continue
      const gp = gradeRank[row.grade] ?? 0
      credits += c
      points += c * gp
    }
    const gpa = credits > 0 ? points / credits : 0
    const topGrades = (sem.rows ?? [])
      .map((r) => String(r.grade || '').trim())
      .filter(Boolean)
      .sort((a, b) => (gradeRank[b] ?? -1) - (gradeRank[a] ?? -1))
      .slice(0, 3)
    return { label: sem.name || `Sem ${index + 1}`, gpa: Number(gpa.toFixed(2)), topGrades }
  })

  const width = 280
  const height = 80
  const pad = 8
  const minGpa = semData.length ? Math.min(...semData.map((d) => d.gpa)) : 0
  const maxGpa = semData.length ? Math.max(...semData.map((d) => d.gpa)) : 10
  const range = Math.max(maxGpa - minGpa, 0.5)
  const points = semData.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / Math.max(semData.length - 1, 1)
    const norm = (d.gpa - minGpa) / range
    const y = height - pad - norm * (height - pad * 2)
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div
      id="share-card"
      ref={ref}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '900px',
        background: '#111827',
        border: '1px solid rgba(139,92,246,0.2)',
        color: '#e5e7eb',
        padding: '32px',
        borderRadius: '20px',
        boxShadow: '0 0 40px rgba(139,92,246,0.2)',
        fontFamily: 'sans-serif',
        zIndex: -1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, opacity: 0.8, color: '#a1a1aa' }}>CGPA</p>
          <h1 style={{ fontSize: '72px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>
            {cgpa?.toFixed(2) || '0.00'}
          </h1>
          <p style={{ margin: '5px 0', color: '#d4d4d8' }}>Total Credits: {totalCredits}</p>
          <p style={{ margin: '5px 0 20px 0', color: '#d4d4d8' }}>Total Grade Points: {totalGradePoints.toFixed(2)}</p>

          <div>
            {semData.map((s, i) => (
              <p key={i} style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9, color: '#a1a1aa' }}>
                {s.label} → Best:{' '}
                <span style={{ color: '#c4b5fd' }}>
                  {s.topGrades.length > 0 ? s.topGrades.join(', ') : '—'}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div style={{ width: '300px' }}>
          {typeof targetCgpa === 'number' && Number.isFinite(targetCgpa) ? (
            <div
              style={{
                marginBottom: '12px',
                borderRadius: '12px',
                padding: '10px 12px',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: '#c4b5fd',
              }}
            >
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>Target</div>
              <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{targetCgpa.toFixed(2)}</div>
            </div>
          ) : null}
          <div
            style={{
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '12px',
              padding: '10px',
              background: 'rgba(17,24,39,0.55)',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CGPA Trend
            </p>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
              <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="2.8" fill="#8b5cf6" />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* WATERMARK */}
      <p style={{ marginTop: '30px', opacity: 0.6, fontSize: '14px', color: '#a1a1aa' }}>
        Made with SemTrackify 🚀
      </p>
    </div>
  )
})
