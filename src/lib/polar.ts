import { Polar } from '@polar-sh/sdk';

let polarInstance: Polar | null = null;

export function getPolar(accessToken: string): Polar {
  if (!polarInstance) {
    polarInstance = new Polar({
      accessToken,
      // Use 'sandbox' for testing, 'production' for live
      server: 'sandbox',
    });
  }
  return polarInstance;
}

export function createPolar(accessToken: string): Polar {
  return new Polar({
    accessToken,
    server: 'sandbox',
  });
}

// Map Polar subscription status to our internal status
export function mapPolarStatus(
  polarStatus: string
): 'active' | 'cancelled' | 'expired' | 'paused' {
  switch (polarStatus) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'canceled':
    case 'cancelled':
      return 'cancelled';
    case 'past_due':
    case 'unpaid':
      return 'paused';
    case 'incomplete':
    case 'incomplete_expired':
    case 'ended':
    default:
      return 'expired';
  }
}
