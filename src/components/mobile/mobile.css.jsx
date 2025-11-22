/**
 * GlyphLock Mobile Responsive Layer
 * Bonded scaling system - groups scale together as locked units
 * Desktop remains untouched - mobile overrides only
 */

:root {
  --mobile-scale-hero: 1;
  --mobile-scale-bg: 1;
  --mobile-scale-ui: 1;
  --mobile-scale-cursor: 1;
  --mobile-safe-top: env(safe-area-inset-top, 0px);
  --mobile-safe-bottom: env(safe-area-inset-bottom, 0px);
  --mobile-safe-left: env(safe-area-inset-left, 0px);
  --mobile-safe-right: env(safe-area-inset-right, 0px);
}

/* ============================================
   MOBILE BASE FIXES
   ============================================ */
@media (max-width: 760px) {
  /* Prevent iOS auto-zoom on inputs */
  input,
  textarea,
  select {
    font-size: 16px !important;
  }

  /* Fix iOS viewport height */
  body {
    min-height: -webkit-fill-available;
  }

  html {
    height: -webkit-fill-available;
  }

  /* Disable iOS text size adjust */
  body {
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  /* Smooth momentum scrolling */
  * {
    -webkit-overflow-scrolling: touch;
  }
}

/* ============================================
   BONDED GROUP 1: HERO BLOCK
   Video, Logo, Watermark, Overlay Text
   ============================================ */
@media (max-width: 760px) {
  :root {
    --mobile-scale-hero: 0.75;
  }

  /* Hero container maintains aspect ratio lock */
  .hero-section,
  [class*="hero"] {
    transform: scale(var(--mobile-scale-hero));
    transform-origin: center top;
  }

  /* Video and logo scale as one bonded unit */
  .hero-section video,
  .hero-section img,
  .hero-section .logo,
  .hero-section [class*="watermark"] {
    transform: scale(1) !important; /* Inherit parent scale only */
  }

  /* Hero text maintains relative position */
  .hero-section h1,
  .hero-section .hero-title {
    font-size: calc(3rem * var(--mobile-scale-hero));
    line-height: 1.1;
  }

  .hero-section p,
  .hero-section .hero-subtitle {
    font-size: calc(1.125rem * var(--mobile-scale-hero));
  }
}

@media (max-width: 600px) {
  :root {
    --mobile-scale-hero: 0.65;
  }

  .hero-section h1,
  .hero-section .hero-title {
    font-size: calc(2.5rem * var(--mobile-scale-hero));
  }
}

@media (max-width: 480px) {
  :root {
    --mobile-scale-hero: 0.55;
  }

  .hero-section h1,
  .hero-section .hero-title {
    font-size: calc(2rem * var(--mobile-scale-hero));
  }
}

@media (max-width: 380px) {
  :root {
    --mobile-scale-hero: 0.5;
  }
}

/* ============================================
   BONDED GROUP 2: BACKGROUND SYSTEM
   Nebula, Neural Lines, Glow, Grain, Stars
   ============================================ */
@media (max-width: 760px) {
  :root {
    --mobile-scale-bg: 0.8;
  }

  /* All background layers scale together */
  .interactive-nebula,
  [class*="nebula"],
  [class*="background"],
  .animated-background,
  [class*="neural"],
  [class*="glow-layer"] {
    transform: scale(var(--mobile-scale-bg));
    transform-origin: center center;
  }

  /* Preserve focal point - no crop drift */
  .interactive-nebula canvas,
  [class*="nebula"] canvas {
    object-fit: cover;
    object-position: center center;
  }

  /* Reduce particle density for performance, not composition */
  [data-particle-system] {
    --particle-density: 0.6;
  }
}

@media (max-width: 480px) {
  :root {
    --mobile-scale-bg: 0.7;
  }

  [data-particle-system] {
    --particle-density: 0.4;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .interactive-nebula,
  [class*="animated"],
  [class*="parallax"] {
    animation: none !important;
    transition: none !important;
  }

  [data-particle-system] {
    opacity: 0.3;
  }
}

/* ============================================
   BONDED GROUP 3: CURSOR & NOTES
   Cursor, Trails, Scribbles, Callouts
   ============================================ */
@media (max-width: 760px) {
  :root {
    --mobile-scale-cursor: 1.2;
  }

  /* Convert hover to touch, preserve offset ratios */
  [class*="cursor"],
  [data-cursor],
  .custom-cursor {
    transform: scale(var(--mobile-scale-cursor));
    pointer-events: none;
  }

  /* Touch-based note reveals */
  [class*="note"],
  [class*="callout"],
  [data-note] {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  [class*="note"].active,
  [class*="callout"].active,
  [data-note].active {
    opacity: 1;
  }

  /* Maintain relative follow distance */
  [data-follow-distance] {
    --follow-distance: calc(20px * var(--mobile-scale-cursor));
  }
}

@media (hover: none) and (pointer: coarse) {
  /* Hide cursor on true touch devices */
  [class*="cursor"]:not(.mobile-touch-indicator),
  [data-cursor]:not(.mobile-touch-indicator) {
    display: none;
  }
}

/* ============================================
   BONDED GROUP 4: UI CHROME
   Nav, Buttons, Icons, Controls
   ============================================ */
@media (max-width: 760px) {
  :root {
    --mobile-scale-ui: 1.15;
  }

  /* Nav bar scales proportionally */
  nav,
  header nav,
  .navbar,
  [role="navigation"] {
    padding: calc(1rem * var(--mobile-scale-ui));
  }

  /* Enlarge tap targets while maintaining geometric ratios */
  nav a,
  nav button,
  header a,
  header button {
    min-height: 48px;
    min-width: 48px;
    padding: calc(0.75rem * var(--mobile-scale-ui)) calc(1.25rem * var(--mobile-scale-ui));
  }

  /* Scale icon size proportionally */
  nav svg,
  nav img,
  header svg,
  header img {
    width: calc(1.25rem * var(--mobile-scale-ui));
    height: calc(1.25rem * var(--mobile-scale-ui));
  }

  /* CTAs maintain spacing ratio */
  .btn,
  button,
  [class*="button"],
  a[class*="cta"] {
    min-height: 56px;
    padding: calc(1rem * var(--mobile-scale-ui)) calc(2rem * var(--mobile-scale-ui));
    font-size: calc(1rem * var(--mobile-scale-ui));
  }

  /* Maintain geometric spacing in button groups */
  .btn + .btn,
  button + button {
    margin-left: calc(1rem * var(--mobile-scale-ui));
  }

  /* Floating action buttons */
  [class*="floating"],
  [class*="fab"],
  .chat-button,
  .mic-button {
    width: calc(64px * var(--mobile-scale-ui));
    height: calc(64px * var(--mobile-scale-ui));
    bottom: calc(24px + var(--mobile-safe-bottom));
    right: calc(24px + var(--mobile-safe-right));
  }
}

@media (max-width: 600px) {
  :root {
    --mobile-scale-ui: 1.25;
  }

  /* Increase tap targets further */
  nav a,
  nav button,
  header a,
  header button {
    min-height: 52px;
    min-width: 52px;
  }

  .btn,
  button {
    min-height: 60px;
  }
}

@media (max-width: 480px) {
  :root {
    --mobile-scale-ui: 1.35;
  }

  nav a,
  nav button {
    min-height: 56px;
  }

  .btn,
  button {
    min-height: 64px;
  }
}

/* ============================================
   LAYOUT ADJUSTMENTS
   Stack changes that preserve alignment bonds
   ============================================ */
@media (max-width: 760px) {
  /* Container padding with safe areas */
  .container,
  [class*="container"] {
    padding-left: max(1.5rem, var(--mobile-safe-left));
    padding-right: max(1.5rem, var(--mobile-safe-right));
  }

  /* Grid to stack - maintain vertical rhythm */
  .grid,
  [class*="grid"] {
    grid-template-columns: 1fr !important;
    gap: calc(2rem * var(--mobile-scale-ui));
  }

  /* Flex column - preserve item spacing ratios */
  .flex-row,
  [class*="flex-row"] {
    flex-direction: column;
    gap: calc(1.5rem * var(--mobile-scale-ui));
  }

  /* Section spacing scales proportionally */
  section,
  [class*="section"] {
    padding-top: calc(4rem * var(--mobile-scale-ui));
    padding-bottom: calc(4rem * var(--mobile-scale-ui));
  }
}

@media (max-width: 600px) {
  .container,
  [class*="container"] {
    padding-left: max(1rem, var(--mobile-safe-left));
    padding-right: max(1rem, var(--mobile-safe-right));
  }
}

@media (max-width: 480px) {
  section,
  [class*="section"] {
    padding-top: calc(3rem * var(--mobile-scale-ui));
    padding-bottom: calc(3rem * var(--mobile-scale-ui));
  }
}

/* ============================================
   TYPOGRAPHY
   Readable without zoom, preserving hierarchy
   ============================================ */
@media (max-width: 760px) {
  h1,
  .text-5xl,
  .text-6xl,
  .text-7xl {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.1;
  }

  h2,
  .text-4xl {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }

  h3,
  .text-3xl {
    font-size: clamp(1.5rem, 3.5vw, 2rem);
  }

  h4,
  .text-2xl {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }

  p,
  .text-base {
    font-size: 1rem;
    line-height: 1.6;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .text-xs {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  h1,
  .text-5xl,
  .text-6xl,
  .text-7xl {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
  }
}

/* ============================================
   CARDS & PANELS
   Maintain glass effect and spacing
   ============================================ */
@media (max-width: 760px) {
  .card,
  [class*="card"],
  .glass-card,
  [class*="panel"] {
    padding: calc(1.5rem * var(--mobile-scale-ui));
    margin-bottom: calc(1.5rem * var(--mobile-scale-ui));
  }

  /* Preserve border thickness and glow */
  .card,
  .glass-card {
    border-width: 1px; /* No scale */
  }
}

@media (max-width: 480px) {
  .card,
  [class*="card"],
  .glass-card {
    padding: calc(1.25rem * var(--mobile-scale-ui));
  }
}

/* ============================================
   FORMS & INPUTS
   Touch-friendly, no iOS zoom
   ============================================ */
@media (max-width: 760px) {
  input,
  textarea,
  select {
    min-height: 48px;
    padding: calc(0.875rem * var(--mobile-scale-ui)) calc(1rem * var(--mobile-scale-ui));
    font-size: 16px !important; /* Prevent iOS zoom */
  }

  input[type="checkbox"],
  input[type="radio"] {
    min-width: 24px;
    min-height: 24px;
  }

  label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
}

/* ============================================
   MODALS & DRAWERS
   Full-screen safe area handling
   ============================================ */
@media (max-width: 760px) {
  [role="dialog"],
  .modal,
  [class*="modal"],
  .drawer {
    max-width: 100vw;
    max-height: 100dvh;
    padding-top: var(--mobile-safe-top);
    padding-bottom: var(--mobile-safe-bottom);
  }

  .modal-content,
  [class*="modal-content"] {
    padding: calc(1.5rem * var(--mobile-scale-ui));
  }
}

/* ============================================
   TABLES
   Horizontal scroll with sticky headers
   ============================================ */
@media (max-width: 760px) {
  .table-container,
  [class*="table-wrapper"] {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 600px;
  }

  th,
  td {
    padding: calc(0.75rem * var(--mobile-scale-ui));
    font-size: 0.875rem;
  }
}

/* ============================================
   ANIMATIONS
   Reduced motion friendly
   ============================================ */
@media (max-width: 760px) {
  * {
    scroll-behavior: smooth;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */
@media (max-width: 760px) {
  /* GPU acceleration for smooth transforms */
  .hero-section,
  [class*="animated"],
  [class*="nebula"],
  [class*="cursor"] {
    will-change: transform;
    transform: translateZ(0);
  }

  /* Lazy load indicator */
  [data-lazy]:not([data-loaded]) {
    opacity: 0;
  }

  [data-lazy][data-loaded] {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
}

/* ============================================
   ORIENTATION LOCK PRESERVATION
   Prevent drift on rotate
   ============================================ */
@media (orientation: landscape) and (max-height: 500px) {
  /* Compact landscape mode */
  :root {
    --mobile-scale-hero: 0.6;
    --mobile-scale-ui: 1.1;
  }

  .hero-section {
    min-height: 100vh;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (max-width: 760px) {
  /* Ensure focus visible on touch */
  *:focus-visible {
    outline: 2px solid #00E4FF;
    outline-offset: 2px;
  }

  /* Larger touch targets for accessibility */
  button:focus,
  a:focus,
  input:focus {
    outline-width: 3px;
  }
}

/* ============================================
   ANDROID SPECIFIC FIXES
   ============================================ */
@supports (-webkit-appearance: none) {
  @media (max-width: 760px) {
    /* Fix Android viewport bug */
    body {
      min-height: 100vh;
      min-height: -webkit-fill-available;
    }

    /* Fix Android input zoom */
    input,
    textarea,
    select {
      font-size: 16px !important;
    }
  }
}