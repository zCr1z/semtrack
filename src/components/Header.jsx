import { AnimatedNumber } from './AnimatedNumber.jsx'
import { useHeaderCompact } from '../hooks/useHeaderCompact.js'
import html2canvas from 'html2canvas'
import { useState, useEffect } from 'react'
import { DonateModal } from './DonateModal.jsx'

/**
 * @param {{
 *   totalCredits: number
 *   totalGradePoints: number
 *   darkMode: boolean
 *   onToggleDark: () => void
 *   semesters?: Array
 *   targetCgpa?: number | null
 * }} props
 */
export function Header({ totalCredits, totalGradePoints, darkMode, onToggleDark, semesters = [], isLoaded = false, targetCgpa = null }) {
  const { compact, reducedMotion } = useHeaderCompact()
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  const totalSubjects = semesters.reduce((sum, sem) => sum + (sem.rows?.length || 0), 0)

  // Show tooltip once per session IF support button conditions are met
  useEffect(() => {
    if (semesters.length >= 2 && totalSubjects > 0) {
      const hasSeen = sessionStorage.getItem('gpacalc-support-tooltip')
      if (!hasSeen) {
        const timer = setTimeout(() => setShowTooltip(true), 1000)
        const hideTimer = setTimeout(() => {
          setShowTooltip(false)
          sessionStorage.setItem('gpacalc-support-tooltip', 'true')
        }, 4000)
        return () => { clearTimeout(timer); clearTimeout(hideTimer); }
      }
    }
  }, [semesters.length, totalSubjects])

  const [animatedCgpa, setAnimatedCgpa] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;

    let start = 0;
    const end = cgpa;
    const duration = 800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCgpa(end.toFixed(2));
        clearInterval(timer);
      } else {
        setAnimatedCgpa(start.toFixed(2));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [cgpa, isLoaded]);

  const [animatedCredits, setAnimatedCredits] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);

  const showToast = (message, timeout = 2800) => {
    setToastMsg(message)
    window.setTimeout(() => setToastMsg(''), timeout)
  }

  useEffect(() => {
    if (!isLoaded) return;

    const duration = 800;
    const stepTime = 16;
    let startCredits = 0;
    let startPoints = 0;
    const creditIncrement = totalCredits / (duration / stepTime);
    const pointIncrement = totalGradePoints / (duration / stepTime);

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        startCredits += creditIncrement;
        startPoints += pointIncrement;
        if (startCredits >= totalCredits && startPoints >= totalGradePoints) {
          setAnimatedCredits(totalCredits);
          setAnimatedPoints(totalGradePoints);
          clearInterval(interval);
        } else {
          setAnimatedCredits(startCredits);
          setAnimatedPoints(startPoints);
        }
      }, stepTime);
      return () => clearInterval(interval);
    }, 150);

    return () => clearTimeout(timer);
  }, [totalCredits, totalGradePoints, isLoaded]);

  const generateImage = async () => {
    if (!cgpa || semesters.length === 0) {
      throw new Error("No data to generate image");
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const gradeRank = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 }

    const formattedSems = semesters.map((sem, index) => {
      let credits = 0
      let points = 0
      for (const row of sem.rows ?? []) {
        const c = parseFloat(row.credits)
        if (!isFinite(c) || c <= 0) continue
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
      return {
        label: sem.name || `Sem ${index + 1}`,
        gpa: parseFloat(gpa.toFixed(2)),
        credits: parseFloat(credits.toFixed(1)),
        topGrades,
      }
    })

    const graphPoints = formattedSems.length > 1 ? formattedSems : []
    const width = 280
    const height = 80
    const pad = 8
    const minGpa = graphPoints.length > 0 ? Math.min(...graphPoints.map((d) => d.gpa)) : 0
    const maxGpa = graphPoints.length > 0 ? Math.max(...graphPoints.map((d) => d.gpa)) : 10
    const range = Math.max(maxGpa - minGpa, 0.5)

    const plotted = graphPoints.map((d, i) => {
      const x = pad + (i * (width - pad * 2)) / Math.max(graphPoints.length - 1, 1)
      const norm = (d.gpa - minGpa) / range
      const y = height - pad - norm * (height - pad * 2)
      return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }
    })

    const graphPath = plotted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const graphDots = plotted.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="2.8" fill="#8b5cf6" />`).join('')

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              background: #0b0b0f;
              font-family: Arial, sans-serif;
              color: #e5e7eb;
            }

            .card {
              width: 900px;
              padding: 40px;
              border-radius: 20px;
              border: 1px solid rgba(139,92,246,0.2);
              box-shadow: 0 0 40px rgba(139,92,246,0.25);
              background: #111827;
              box-sizing: border-box;
            }

            .title {
              font-size: 14px;
              opacity: 0.6;
              margin-bottom: 10px;
            }

            .cgpa {
              font-size: 72px;
              font-weight: 700;
              color: #ffffff;
              margin-bottom: 16px;
              text-shadow: 0 0 20px rgba(139,92,246,0.4);
            }

            .stats {
              margin-bottom: 16px;
              opacity: 0.85;
            }

            .sem {
              margin: 5px 0;
              font-size: 12px;
              color: #a1a1aa;
            }

            .footer {
              margin-top: 18px;
              font-size: 12px;
              opacity: 0.5;
            }

            .accent-line {
              height: 3px;
              width: 120px;
              background: #8b5cf6;
              border-radius: 10px;
              margin-bottom: 18px;
            }

            .layout {
              display: flex;
              gap: 24px;
              align-items: flex-start;
            }

            .left {
              flex: 1;
              min-width: 0;
            }

            .right {
              width: 300px;
            }

            .target {
              display: inline-flex;
              flex-direction: column;
              gap: 4px;
              padding: 10px 12px;
              border-radius: 12px;
              background: rgba(139,92,246,0.1);
              border: 1px solid rgba(139,92,246,0.2);
              color: #c4b5fd;
              margin-bottom: 12px;
            }

            .target-label {
              font-size: 11px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              opacity: 0.8;
            }

            .target-value {
              font-size: 22px;
              font-weight: 700;
              line-height: 1;
            }

            .trend-wrap {
              border: 1px solid rgba(139,92,246,0.2);
              border-radius: 12px;
              padding: 10px;
              background: rgba(17,24,39,0.55);
            }

            .trend-title {
              margin: 0 0 8px 0;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #a1a1aa;
            }

            .grade-chip {
              color: #c4b5fd;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="accent-line"></div>

            <div class="layout">
              <div class="left">
                <div class="title">CGPA</div>
                <div class="cgpa">${cgpa > 0 ? cgpa.toFixed(2) : "0.00"}</div>

                <div class="stats">
                  <p style="margin: 5px 0;">Total Credits: ${totalCredits}</p>
                  <p style="margin: 5px 0;">Total Grade Points: ${totalGradePoints.toFixed(2)}</p>
                </div>

                <div>
                  ${formattedSems.map((s, i) => `
                    <div class="sem">
                      ${s.label || `Sem ${i + 1}`} → Best: ${s.topGrades.length > 0 ? s.topGrades.map((g) => `<span class="grade-chip">${g}</span>`).join(', ') : '<span class="grade-chip">—</span>'}
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="right">
                ${typeof targetCgpa === 'number' && isFinite(targetCgpa) ? `
                  <div class="target">
                    <div class="target-label">Target</div>
                    <div class="target-value">${targetCgpa.toFixed(2)}</div>
                  </div>
                ` : ''}

                <div class="trend-wrap">
                  <p class="trend-title">CGPA Trend</p>
                  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                    <path d="${graphPath || ''}" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    ${graphDots}
                  </svg>
                </div>
              </div>
            </div>

            <div class="footer">
              Made with SemTrackify 🚀
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    await new Promise(r => setTimeout(r, 500));

    const node = iframe.contentDocument.body;

    const canvas = await html2canvas(node, {
      backgroundColor: "#0b0b0f",
      scale: 2
    });

    document.body.removeChild(iframe);

    if (!canvas) {
      throw new Error("Canvas generation failed");
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Blob failed"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  };

  const handleShareCard = async () => {
    showToast('Share your CGPA 🚀')
    try {
      const blob = await generateImage();

      const file = new File([blob], "semtrackify.png", {
        type: "image/png"
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      showToast("You're motivating others 👀", 3200)

    } catch (err) {
      if (err?.name !== 'AbortError') {
        showToast('Share failed. Try again.')
      }
    }
  }

  return (
    <header
      className={`header-root sticky top-0 z-40 ${reducedMotion ? 'header-root--reduce-motion' : ''}`}
      data-compact={compact ? 'true' : 'false'}
    >
      <div className="header-inner mx-auto max-w-4xl px-4 sm:px-6">
        <div className="hdr-title-row flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="SemTrack logo"
              className="hdr-logo h-8 w-8 shrink-0"
              width="32"
              height="32"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h1 className="hdr-h1 font-sans font-semibold tracking-tight text-zinc-950 dark:text-white">
                SemTrackify
              </h1>
              <p className="header-tagline max-w-md text-left text-[13px] leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400">
                Know your numbers. Control your future.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Support heart — show when ≥2 sems + subjects */}
            {(semesters.length >= 2 && totalSubjects > 0) && (
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="hdr-theme-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white/50 text-violet-500 shadow-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 active:scale-[0.96] dark:border-violet-500/30 dark:bg-zinc-900/50 dark:text-violet-400 dark:hover:border-violet-500/60 dark:hover:bg-violet-900/30"
                  aria-label="Support SemTrackify"
                >
                  <HeartIcon className="h-4 w-4" />
                </button>

                {showTooltip && (
                  <div
                    className="absolute top-[calc(100%+10px)] right-0 z-50 w-max origin-top-right rounded-xl bg-[#111827] px-3 py-1.5 text-xs font-medium text-violet-100 shadow-xl ring-1 ring-white/10 pointer-events-none"
                    style={{ animation: 'bounceFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                  >
                    Enjoying this?
                    <div className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-[#111827] ring-1 ring-white/10 [clip-path:polygon(0_0,100%_0,0_100%)]"/>
                  </div>
                )}
              </div>
            )}

            {/* Share button — show when ≥1 sem + subjects */}
            {(semesters.length >= 1 && totalSubjects > 0) && (
              <button
                type="button"
                onClick={() => {
                  handleShareCard();
                }}
                className="group flex will-change-transform items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.25)] transition-all duration-200 hover:scale-[1.03] hover:bg-violet-700 hover:shadow-[0_0_24px_rgba(139,92,246,0.28)] active:scale-[0.97] dark:bg-violet-500 dark:hover:bg-violet-600"
                aria-label="Share your CGPA card"
              >
                <ShareIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="hidden xs:inline sm:inline">Share</span>
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              className="hdr-theme-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200/90 bg-white text-zinc-600 shadow-sm transition-colors duration-200 hover:border-violet-300/80 hover:bg-violet-50/60 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.96] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-violet-500/50 dark:hover:bg-violet-950/50 dark:hover:text-violet-200 dark:focus-visible:ring-violet-400/45 dark:focus-visible:ring-offset-zinc-950"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div id="cgpa-summary" className="mt-4 flex flex-col gap-3">
          <div
            className="relative overflow-hidden rounded-2xl px-5 py-5 text-center sm:rounded-3xl sm:py-6"
            style={
              darkMode
                ? {
                    background: '#111827',
                    border: '1px solid rgba(139,92,246,0.2)',
                    boxShadow: '0 0 40px rgba(139,92,246,0.15)',
                    minHeight: '120px',
                  }
                : {
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    minHeight: '120px',
                  }
            }
          >
            <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 dark:text-zinc-400 mb-1">CGPA</p>
            <p className="absolute inset-x-0 top-0 h-px bg-violet-300/20" aria-hidden="true" />
            <p
              className="text-5xl sm:text-6xl font-bold leading-none tracking-tighter"
              style={{
                textShadow: '0 0 20px rgba(139,92,246,0.35)',
                color: darkMode ? '#ffffff' : '#111827',
              }}
            >
              {cgpa > 0 ? animatedCgpa : "--"}
            </p>
          </div>

          <div className="flex w-full gap-2 px-1">
            <StatPill label="Credits" value={animatedCredits % 1 ? animatedCredits.toFixed(1) : String(Math.round(animatedCredits))} />
            <StatPill label="Grade Pts" value={animatedPoints.toFixed(2)} />
          </div>
        </div>

      </div>

      <DonateModal 
        isOpen={isDonateOpen} 
        onClose={() => setIsDonateOpen(false)} 
      />

      {toastMsg && (
        <div 
          className="fixed left-1/2 z-50 -translate-x-1/2 rounded-full border border-violet-500/30 bg-[#111827] px-5 py-2.5 text-sm font-medium text-violet-200 shadow-lg"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))', animation: 'fadeInUp 0.3s ease-out forwards' }}
        >
          {toastMsg}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeInUp {
              from { opacity: 0; transform: translate(-50%, 10px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
            @keyframes bounceFadeIn {
              from { opacity: 0; transform: scale(0.9) translateY(4px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}} />
        </div>
      )}
    </header>
  )
}

/**
 * @param {{ label: string; value: string }} props
 */
function StatPill({ label, value }) {
  return (
    <div className="flex w-1/2 items-center justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60 transition-all duration-200 hover:border-violet-300/45">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="text-lg font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
        <AnimatedNumber value={value} />
      </span>
    </div>
  )
}

function MoonIcon() {
  return (
    <svg className="block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  )
}

function ShareIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
