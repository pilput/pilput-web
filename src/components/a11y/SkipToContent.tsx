/**
 * Keyboard-only escape hatch past the nav. Render it on pages that actually
 * expose a `<main id="main-content">` landmark — a skip link pointing at a
 * missing target is worse than none.
 */
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    Skip to content
  </a>
);

export default SkipToContent;
