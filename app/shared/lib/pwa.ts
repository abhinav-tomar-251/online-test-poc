/**
 * Utility functions for PWA functionality
 */

/**
 * Opens the dashboard page in the installed PWA application
 * Works by storing the target route in localStorage and then launching the PWA
 */
export function openDashboardInPWA() {
  if (typeof window === 'undefined') return;

  // Set the target route in localStorage
  try {
    localStorage.setItem('pwa_redirect_route', '/dashboard');
    
    // Get the base URL from the manifest
    const pwaUrl = window.location.origin;
    
    // Try to open the PWA via the start_url
    const pwaWindow = window.open(pwaUrl, '_blank');
    
    // If popup blocked or doesn't work, fallback to normal navigation
    if (!pwaWindow || pwaWindow.closed || typeof pwaWindow.closed === 'undefined') {
      window.location.href = '/dashboard';
    }
  } catch (e) {
    console.error("Error opening dashboard in PWA:", e);
    // Fallback
    window.location.href = '/dashboard';
  }
}

/**
 * Gets the redirect route from localStorage if present
 * This should be called when the PWA starts up
 */
export function getRedirectRoute(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const route = localStorage.getItem('pwa_redirect_route');
    // Clear the route after reading it
    if (route) {
      localStorage.removeItem('pwa_redirect_route');
    }
    return route;
  } catch (e) {
    console.error("Error getting redirect route:", e);
    return null;
  }
}

/**
 * Checks if the PWA is installed on the device
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if the app is installed using display-mode
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