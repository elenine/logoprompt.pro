// Subscription plan configuration
// Update the PRODUCT_ID with your actual Polar product ID after creating it

export const SUBSCRIPTION_PLAN = {
  id: 'pro',
  name: 'Pro',
  description: 'Remove all advertisements and support LogoPrompt.pro',
  // Replace with your actual Polar product ID
  polarProductId: 'YOUR_POLAR_PRODUCT_ID',
  features: [
    'Ad-free browsing experience',
    'Support the development of LogoPrompt.pro',
    'Priority access to new features',
  ],
  price: {
    monthly: 5,
    currency: 'USD',
  },
} as const;

export function isValidProductId(productId: string): boolean {
  return productId === SUBSCRIPTION_PLAN.polarProductId;
}

export function getSubscriptionPlan() {
  return SUBSCRIPTION_PLAN;
}
