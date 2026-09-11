export function LogoIcon({ className = 'w-7 h-7' }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="#1B1224" strokeWidth="2" />
      <path
        d="M8.5 16.5c1.8 0 1.8-4 3.6-4s1.8 4 3.6 4 1.8-4 3.6-4 1.8 4 3.6 4"
        stroke="#7A4FE0"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PulseOrb({ animate = true, className = 'w-36 h-36' }) {
  return (
    <svg className={`${className} mx-auto`} viewBox="0 0 150 150">
      <circle
        cx="75"
        cy="75"
        r="40"
        fill="none"
        stroke="#1B1224"
        strokeWidth="2"
        className={animate ? 'animate-ping opacity-25 origin-center' : 'opacity-20'}
      />
      <circle
        cx="75"
        cy="75"
        r="48"
        fill="none"
        stroke="#1B1224"
        strokeWidth="1.5"
        className={animate ? 'animate-pulse opacity-30 origin-center' : 'opacity-15'}
      />
      <circle cx="75" cy="75" r="34" fill="#EFE4FB" stroke="#1B1224" strokeWidth="2" />
      <circle cx="75" cy="75" r="20" fill="#7A4FE0" stroke="#1B1224" strokeWidth="2" />
    </svg>
  );
}

export function PeopleIcon({ className = 'w-3.5 h-3.5 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15.5 14.2c2.7.4 4.5 2.4 4.5 5.3" />
    </svg>
  );
}

export function ClipboardIcon({ className = 'w-3.5 h-3.5 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M8.5 11h7M8.5 15h7" />
    </svg>
  );
}

export function BoltIcon({ className = 'w-3.5 h-3.5 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function KeyIcon({ className = 'w-3.5 h-3.5 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.9 12.1 20 3M16 7l3 3M19 4l3 3" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-3.5 h-3.5 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5L20 6" />
    </svg>
  );
}

export function CalendarIcon({ className = 'w-3 h-3 inline-block -mt-0.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}
