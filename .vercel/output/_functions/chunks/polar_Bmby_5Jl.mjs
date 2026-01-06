import { Polar } from '@polar-sh/sdk';

function createPolar(accessToken) {
  return new Polar({
    accessToken,
    server: "sandbox"
  });
}
function mapPolarStatus(polarStatus) {
  switch (polarStatus) {
    case "active":
    case "trialing":
      return "active";
    case "canceled":
    case "cancelled":
      return "cancelled";
    case "past_due":
    case "unpaid":
      return "paused";
    case "incomplete":
    case "incomplete_expired":
    case "ended":
    default:
      return "expired";
  }
}

export { createPolar as c, mapPolarStatus as m };
