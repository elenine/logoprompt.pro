const SUBSCRIPTION_PLAN = {
  id: "pro",
  name: "Pro",
  description: "Remove all advertisements and support LogoPrompt.pro",
  // Replace with your actual Polar product ID
  polarProductId: "YOUR_POLAR_PRODUCT_ID",
  features: [
    "Ad-free browsing experience",
    "Support the development of LogoPrompt.pro",
    "Priority access to new features"
  ],
  price: {
    monthly: 5,
    currency: "USD"
  }
};
function isValidProductId(productId) {
  return productId === SUBSCRIPTION_PLAN.polarProductId;
}

export { SUBSCRIPTION_PLAN as S, isValidProductId as i };
