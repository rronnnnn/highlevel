// Shared timing so the Hero's load-in zoom starts exactly as the
// preloader's black overlay begins revealing it, instead of racing ahead
// underneath the still-opaque screen.
export const PRELOADER_LOGO_IN_MS = 500;
export const PRELOADER_LOGO_HOLD_MS = 700;
export const PRELOADER_LOGO_OUT_MS = 500;
export const PRELOADER_REVEAL_MS =
  PRELOADER_LOGO_IN_MS + PRELOADER_LOGO_HOLD_MS + PRELOADER_LOGO_OUT_MS; // 1700
export const PRELOADER_OVERLAY_OUT_MS = 500;
export const PRELOADER_TOTAL_MS = PRELOADER_REVEAL_MS + PRELOADER_OVERLAY_OUT_MS; // 2200
