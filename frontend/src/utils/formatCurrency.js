export function formatINR(amount) {
  const value = Number.isFinite(amount) ? amount : 0;
  return `INR ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
