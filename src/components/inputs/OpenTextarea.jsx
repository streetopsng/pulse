export function OpenTextarea({ value = '', onChange, placeholder = 'Type your answer…' }) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full border-2 border-ink rounded-2xl p-4 text-base font-body bg-surface text-ink placeholder:text-ink-faint resize-none focus:outline-none focus:shadow-[3px_3px_0px_#7A4FE0] transition-shadow"
      />
      <div className="text-right text-xs font-bold text-ink-faint mt-1.5 pr-1">
        {(value || '').length} characters
      </div>
    </div>
  );
}
