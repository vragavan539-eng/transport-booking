/**
 * Format a price in Indian rupees
 */
export const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

/**
 * Format a date for display
 */
export const formatDate = (dateStr, options = {}) => {
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', { ...defaults, ...options });
};

/**
 * Format a date with weekday
 */
export const formatDateLong = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

/**
 * Get star string from rating number
 */
export const getStars = (rating) => {
  const full = Math.round(rating || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

/**
 * Get type icon emoji
 */
export const getTypeIcon = (type) => ({
  Bus: '🚌', Train: '🚆', Flight: '✈️', bus: '🚌', train: '🚆', flight: '✈️'
})[type] || '🎫';

/**
 * Get status badge class
 */
export const getStatusClass = (status) => ({
  Confirmed: 'badge-confirmed',
  Cancelled: 'badge-cancelled',
  Pending: 'badge-pending',
  Completed: 'badge-confirmed'
})[status] || 'badge-pending';

/**
 * Calculate fare breakdown
 */
export const calculateFare = (basePrice, passengerCount = 1, taxRate = 0.05, convenienceFee = 40) => {
  const baseFare = basePrice * passengerCount;
  const taxes = Math.round(baseFare * taxRate);
  const totalFare = baseFare + taxes + convenienceFee;
  return { baseFare, taxes, convenienceFee, totalFare };
};

/**
 * Validate passenger object
 */
export const validatePassenger = (passenger, index) => {
  const errors = [];
  if (!passenger.name?.trim()) errors.push(`Passenger ${index + 1}: Name is required`);
  if (!passenger.age || passenger.age < 1 || passenger.age > 120)
    errors.push(`Passenger ${index + 1}: Valid age (1–120) is required`);
  if (!passenger.gender) errors.push(`Passenger ${index + 1}: Gender is required`);
  return errors;
};

/**
 * Truncate text
 */
export const truncate = (str, len = 30) =>
  str?.length > len ? str.substring(0, len) + '...' : str;

/**
 * Get today's date as YYYY-MM-DD string (for date inputs)
 */
export const todayString = () => new Date().toISOString().split('T')[0];

/**
 * Add days to a date, returns YYYY-MM-DD string
 */
export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
