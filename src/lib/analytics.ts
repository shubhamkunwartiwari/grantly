import { inject } from '@vercel/analytics';
import { useGrantlyStore } from './store';

let isInitialized = false;

/**
 * Initializes Vercel Analytics only if user granted cookie consent
 */
export function initAnalytics(): void {
  if (isInitialized) return;
  const consent = useGrantlyStore.getState().cookieConsent;
  if (consent !== 'all') return;

  try {
    inject();
    isInitialized = true;
  } catch {
    // Graceful no-op in local sandboxes or adblock environments
  }
}

/**
 * Track application events safely without throwing or violating privacy
 */
export function track(eventName: string, props?: Record<string, string | number | boolean>): void {
  const consent = useGrantlyStore.getState().cookieConsent;
  if (consent !== 'all') {
    return;
  }

  try {
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', { name: eventName, data: props });
    }
  } catch {
    // Safe no-op
  }
}
