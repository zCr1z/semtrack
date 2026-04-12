/**
 * Remounts inner span when value changes so a one-shot CSS animation runs (no effect/setState).
 * @param {{ value: string; className?: string; variant?: 'default' | 'hero' }} props
 */
export function AnimatedNumber({ value, className = '', variant = 'default' }) {
  const anim = variant === 'hero' ? 'animate-value-hero-once' : 'animate-value-pulse-once'
  return (
    <span className={`tabular-nums ${className}`}>
      <span key={value} className={`inline-block ${anim}`}>
        {value}
      </span>
    </span>
  )
}
