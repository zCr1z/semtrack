import { useEffect, useState } from 'react'

export function SplashScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onFinish, 300)
    }, 1700)
    return () => clearTimeout(exitTimer)
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b0f] transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-splash flex flex-col items-center gap-3">
        <img
          src="/logo.svg"
          alt="SemTrack"
          className="animate-float h-12 w-12"
          width="48"
          height="48"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          SemTrackify
        </h1>
        <p className="text-sm text-zinc-400">
          Know your numbers. Control your future.
        </p>
      </div>
    </div>
  )
}
