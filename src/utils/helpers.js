/**
 * Format numbers with commas (e.g. 18420 -> 18,420)
 */
export function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
}

/**
 * Format Indian Rupee currency (e.g. 150000 -> ₹1,50,000)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Utility for combining Tailwind CSS class strings cleanly
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Relative time formatter (e.g. "5 mins ago", "2 hours ago")
 */
export function timeAgo(timestamp) {
  if (!timestamp) return '';
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return past.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/**
 * Delay execution for simulated async requests
 */
export function sleep(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
