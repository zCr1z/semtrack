import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { calculateGPA } from '../utils/gradeUtils.js'

export function TrendChart({ semesters, isLoaded = false }) {
  const chartData = useMemo(() => {
    if (!semesters || semesters.length < 2) return []

    return semesters.map((sem, index) => {
      const { gpa } = calculateGPA(sem.rows)
      const calculatedGpa = gpa !== null ? gpa : 0
      
      return {
        name: sem.name || `Sem ${index + 1}`,
        gpa: Number(calculatedGpa.toFixed(2)) || 0,
      }
    })
  }, [semesters])

  if (chartData.length < 2) return null

  return (
    <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 w-full min-h-[140px] fade-in fade-in-up">
      <div className="min-h-[140px] rounded-3xl border border-violet-500/20 bg-white/60 p-5 shadow-[0_0_20px_rgba(139,92,246,0.08)] backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/40">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          CGPA Trend
        </h2>
        <div className="h-24 sm:h-28 w-full select-none px-2 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#888' }}
                dy={10}
              />
              <YAxis
                domain={['auto', 'dataMax + 0.1']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#888' }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={isLoaded}
                animationDuration={700}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
