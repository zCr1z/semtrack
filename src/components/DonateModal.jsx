import { useEffect, useState } from 'react'

export function DonateModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)

  const upiId = "chris.binoj@superyes"
  const name = "SemTrackify"
  const note = "Support SemTrackify"
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&tn=${encodeURIComponent(note)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] h-screen w-screen backdrop-blur-md"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.72))',
        animation: 'backdropFadeIn 0.2s ease-out forwards' 
      }}
      onClick={onClose}
      role="presentation"
    >
      {/* ── MOBILE: bottom sheet ── */}
      <div
        className="sm:hidden absolute bottom-0 left-0 right-0 w-full overflow-y-auto bg-[#111827] shadow-[0_0_60px_rgba(139,92,246,0.25)] ring-1 ring-white/5"
        style={{
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          paddingBottom: 'env(safe-area-inset-bottom)',
          animation: 'slideUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Support SemTrackify"
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-white/20" />

        <div className="px-6 pb-6 pt-4 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 transition-all duration-200 hover:scale-[1.03] hover:bg-white/20 hover:text-zinc-200 active:scale-[0.97]"
            aria-label="Close support modal"
          >
            ✕
          </button>

          <h2 className="mb-1.5 text-xl font-bold text-white">Support SemTrackify ❤️</h2>
          <p className="mb-5 text-sm text-zinc-400">
            If this helped you track your CGPA easily, you can support me ☕
          </p>

          <div className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-xl bg-white p-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUrl)}`}
              alt="UPI QR Code"
              width="160"
              height="160"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mb-5 space-y-3">
            <button
              onClick={handleCopy}
              className="flex h-11 w-full will-change-transform items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-sm font-medium text-violet-200 transition-all duration-200 hover:scale-[1.03] hover:bg-violet-500/20 active:scale-[0.97]"
              aria-label="Copy SemTrackify UPI ID"
            >
              {copied ? '✅ UPI ID Copied!' : 'Copy UPI ID'}
            </button>

            <a
              href={upiUrl}
              className="flex h-11 w-full will-change-transform items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.03] hover:bg-violet-700 active:scale-[0.97]"
              aria-label="Open UPI app for support"
            >
              Open UPI App
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            Completely optional — thanks for using SemTrackify 🚀
          </p>
        </div>
      </div>

      {/* ── DESKTOP: centered modal ── */}
      <div
        className="hidden sm:flex fixed inset-0 h-screen w-screen items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative mx-auto w-full max-w-sm rounded-[20px] border border-violet-500/20 bg-[#111827] p-6 shadow-[0_0_60px_rgba(139,92,246,0.25)] ring-1 ring-white/5"
          style={{ animation: 'desktopFadeIn 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Support SemTrackify"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 transition-all duration-200 hover:scale-[1.03] hover:bg-white/20 hover:text-zinc-200 active:scale-[0.97]"
            aria-label="Close support modal"
          >
            ✕
          </button>

          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-white">Support SemTrackify ❤️</h2>
            <p className="mb-6 text-sm text-zinc-400">
              If this helped you track your CGPA easily, you can support me ☕
            </p>

            <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`}
                alt="UPI QR Code"
                width="200"
                height="200"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mb-6 space-y-3">
              <button
                onClick={handleCopy}
                className="flex h-11 w-full will-change-transform items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-sm font-medium text-violet-200 transition-all duration-200 hover:scale-[1.03] hover:bg-violet-500/20 active:scale-[0.97]"
                aria-label="Copy SemTrackify UPI ID"
              >
                {copied ? '✅ UPI ID Copied!' : 'Copy UPI ID'}
              </button>

              <a
                href={upiUrl}
                className="flex h-11 w-full will-change-transform items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.03] hover:bg-violet-700 active:scale-[0.97]"
                aria-label="Open UPI app for support"
              >
                Open UPI App
              </a>
            </div>

            <p className="text-xs text-zinc-500">
              Completely optional — thanks for using SemTrackify 🚀
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes desktopFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(-10px); }
        }
      ` }} />
    </div>
  )
}
