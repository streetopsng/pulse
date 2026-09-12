export function OpenTextarea({ value = '', onChange, placeholder = 'Type your answer…' }) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full border border-slate-200 rounded-xl p-4 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-2xs"
      />
      <div className="text-right text-xs font-medium text-slate-400 mt-1.5 pr-1">
        {(value || '').length} characters
      </div>
    </div>
  );
}
