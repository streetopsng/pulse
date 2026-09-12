export function SurveyContainer({ children, badgeText = 'PARTICIPANT PORTAL' }) {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Top Survey Header */}
      <header className="w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Pulse
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase hidden sm:inline">
            {badgeText}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Encrypted Session</span>
        </div>
      </header>

      {/* Spacious Web Survey Canvas */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-14 px-4 sm:px-6">
        <div className="w-full max-w-2xl sm:max-w-3xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-xl shadow-slate-900/5 relative">
          {children}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-xs font-medium text-slate-400">
        Pulse Platform · Secure Anonymous Continuous Listening
      </footer>
    </div>
  );
}
