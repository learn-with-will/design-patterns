/**
 * The course mark: three rounded "object" nodes wired together — the essence of
 * a design pattern, where a few collaborating objects are arranged into a
 * reusable structure. Amber nodes (#d97706) linked by orange edges (#ea580c),
 * matching the course palette. Callers control size via `className`; the brand
 * colours are fixed so the mark looks consistent in both light and dark themes.
 */
export function DesignPatternsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      {/* collaboration edges between the objects (drawn first, covered by nodes) */}
      <path
        d="M12 5.6 6 18M12 5.6 18 18M6 18h12"
        stroke="#f59e0b"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* three object nodes */}
      <rect x="9" y="2.6" width="6" height="6" rx="1.8" fill="#d97706" />
      <rect x="3" y="15" width="6" height="6" rx="1.8" fill="#ea580c" />
      <rect x="15" y="15" width="6" height="6" rx="1.8" fill="#ea580c" />
    </svg>
  );
}
