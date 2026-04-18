/**
 * Layered icy-mountains parallax + slow-falling snow.
 * Pure CSS/SVG. GPU-accelerated transforms only. Disabled on `prefers-reduced-motion`.
 */
export function IcyBackground() {
  return (
    <div className="icy-bg" aria-hidden="true">
      {/* Sky gradient handled by parent .frost-bg or solid bg */}
      {/* Distant mountains */}
      <svg className="mc-mountains mc-mountains-far" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <polygon points="0,320 0,200 120,140 220,180 340,110 460,170 600,120 740,180 880,130 1020,190 1160,140 1280,200 1440,150 1440,320" fill="oklch(0.30 0.04 250)" />
      </svg>
      <svg className="mc-mountains mc-mountains-mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <polygon points="0,320 0,240 100,180 220,230 360,160 500,220 640,170 800,230 940,180 1080,240 1220,190 1360,250 1440,210 1440,320" fill="oklch(0.24 0.04 252)" />
      </svg>
      <svg className="mc-mountains mc-mountains-near" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <polygon points="0,320 0,280 140,230 280,280 420,220 560,280 700,230 840,290 980,240 1120,290 1260,250 1440,290 1440,320" fill="oklch(0.18 0.035 255)" />
      </svg>
      {/* Snow */}
      <div className="snow snow-1" />
      <div className="snow snow-2" />
      <div className="snow snow-3" />
    </div>
  );
}
