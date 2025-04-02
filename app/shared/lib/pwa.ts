/**
 * Utility functions for PWA functionality
 */

/**
 * Opens the dashboard page in the installed PWA application
 * If the PWA is not installed, it will open in the browser
 */
export function openDashboardInPWA() {
  if (typeof window === 'undefined') return;

  // Check if the app is installed
  if (isPWAInstalled()) {
    // Use the app's URL to open in PWA
    const appUrl = window.location.origin + '/dashboard';
    window.location.href = appUrl;
    
    // If we're in a browser, try to open the PWA
    if (!isPWA()) {
      // This will trigger the PWA to open if installed
      window.open(appUrl, '_blank', 'noopener,noreferrer');
    }
  } else {
    // If not installed, open the web version
    window.location.href = '/dashboard';
  }
}

/**
 * Checks if the PWA is installed on the device
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if the app is installed by checking display mode
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
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