export function Smile() {
  return (
    <svg className="deco deco-smile" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <circle cx="24" cy="24" r="20" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
      <circle cx="31" cy="19" r="1.5" fill="currentColor" />
      <path d="M14 29c3 6 17 6 20 0" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle() {
  return (
    <svg className="deco deco-sparkle" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
      <path d="M24 2c1.5 12 10 20.5 22 22-12 1.5-20.5 10-22 22-1.5-12-10-20.5-22-22C14 22.5 22.5 14 24 2z" />
    </svg>
  );
}

export function Cursor() {
  return (
    <svg className="deco deco-cursor" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 5v34l9-8 6 13 6-3-6-13h12z" />
    </svg>
  );
}
