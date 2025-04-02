/**
 * Utility functions for PWA functionality
 */

/**
 * Opens the dashboard page in the installed PWA application
 * If the PWA is not installed, it will open in the browser
 */
export function openDashboardInPWA() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Try to open in PWA first
    const pwaUrl = `pwa://dashboard`;
    window.location.href = pwaUrl;
    
    // Fallback to web URL after a short delay if PWA doesn't handle it
    setTimeout(() => {
      if (document.hidden) {
        // If the page is hidden, it means the PWA handled the URL
        return;
      }
      // Fallback to web URL
      window.location.href = '/dashboard';
    }, 100);
  }
}

/**
 * Checks if the current page is being viewed in the PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
} 