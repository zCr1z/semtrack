const GRADE_MAP = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
}

export const GRADES = Object.keys(GRADE_MAP)

/**
 * @param {string} grade
 * @returns {number}
 */
export function getGradePoint(grade) {
  return GRADE_MAP[grade] ?? 0
}

/**
 * @param {number} credits
 * @param {string} grade
 * @returns {number}
 */
export function calculateRowTotal(credits, grade) {
  const c = Number(credits)
  if (!Number.isFinite(c) || c <= 0) return 0
  return c * getGradePoint(grade)
}

/**
 * @param {{ credits: string | number; grade: string }[]} rows
 * @returns {{ gpa: number | null; totalCredits: number; totalGradePoints: number }}
 */
export function calculateGPA(rows) {
  let totalGradePoints = 0
  let totalCredits = 0

  for (const row of rows) {
    const raw = typeof row.credits === 'string' ? row.credits.trim() : row.credits
    const c = typeof raw === 'number' ? raw : parseFloat(String(raw))
    if (!Number.isFinite(c) || c <= 0) continue
    const gp = getGradePoint(row.grade)
    totalGradePoints += c * gp
    totalCredits += c
  }

  const gpa = totalCredits === 0 ? null : totalGradePoints / totalCredits
  return { gpa, totalCredits, totalGradePoints }
}

/**
 * @param {string} creditsStr
 * @returns {boolean} true if user entered something invalid (for UI hints)
 */
export function creditsHasError(creditsStr) {
  const t = String(creditsStr).trim()
  if (t === '') return false
  const n = parseFloat(t)
  return !Number.isFinite(n) || n < 0
}

/**
 * Keep only digits and at most one decimal point (for controlled credits field).
 * @param {string} raw
 * @returns {string}
 */
export function sanitizeCreditsInput(raw) {
  let s = String(raw).replace(/[^\d.]/g, '')
  const i = s.indexOf('.')
  if (i === -1) return s
  return s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '')
}

/**
 * @param {string} creditsStr
 * @returns {boolean}
 */
export function creditsIsValidPositive(creditsStr) {
  const t = String(creditsStr).trim()
  if (t === '') return false
  const n = parseFloat(t)
  return Number.isFinite(n) && n > 0
}
