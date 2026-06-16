import React, { useState, useEffect } from 'react'

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show tooltip after 3 seconds on page load
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Dynamic Tooltip */}
      {showTooltip && (
        <div className="mb-3 max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-fadeInDown relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Advisor Online</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            Ada kendala kepatuhan K3/Lingkungan mendesak? Konsultasi cepat via WhatsApp!
          </p>
        </div>
      )}

      {/* Floating CTA Button */}
      <a
        href="https://wa.me/6285328883511?text=Halo%20HSE%20SkillUp,%20saya%20ingin%20konsultasi%20mengenai%20kepatuhan%20K3%20dan%20lingkungan%20perusahaan%20saya."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-5 text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:bg-[#20ba5a] hover:shadow-xl hover:shadow-green-500/30 active:scale-95"
        title="Hubungi Lead Advisor via WhatsApp"
        onClick={() => setShowTooltip(false)}
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
        </span>
        <svg
          className="h-6 w-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2a9.965 9.965 0 0 0-9.969 9.97c0 1.76.459 3.475 1.33 4.993L2 22l5.166-1.354a9.953 9.953 0 0 0 4.865 1.258h.004a9.968 9.968 0 0 0 9.969-9.97A9.967 9.967 0 0 0 12.031 2zm0 1.782c4.515 0 8.188 3.673 8.188 8.188 0 4.515-3.673 8.188-8.188 8.188-1.577 0-3.125-.45-4.474-1.298l-.32-.19-3.053.801.815-2.977-.208-.33a8.138 8.138 0 0 1-1.25-4.384c0-4.515 3.673-8.188 8.188-8.188zM8.75 7.648a.742.742 0 0 0-.54.25c-.218.243-.83.811-.83 1.977 0 1.167.848 2.296.967 2.457.118.162 1.67 2.548 4.045 3.57.565.243 1.006.388 1.35.498.568.18 1.083.155 1.492.094.456-.068 1.4-.572 1.597-1.127.197-.555.197-1.031.138-1.13-.059-.098-.218-.158-.456-.277-.238-.119-1.4-.69-1.618-.77-.218-.08-.377-.119-.536.12-.158.237-.615.772-.753.93-.138.16-.277.179-.515.06a6.5 6.5 0 0 1-1.905-1.176 7.15 7.15 0 0 1-1.319-1.64c-.139-.238-.015-.367.104-.486.107-.107.238-.278.357-.417.119-.138.159-.237.238-.396.079-.158.04-.297-.02-.416-.06-.119-.536-1.288-.734-1.763-.19-.46-.382-.397-.534-.405a2.722 2.722 0 0 0-.317-.004z" />
        </svg>
        <span className="text-sm font-bold tracking-wide">WhatsApp Kami</span>
      </a>
    </div>
  )
}
