/**
 * The function `isTTLExpired` checks if a given time-to-live (TTL) value has expired by comparing it
 * to the current time.
 * @param {number} ttl - Time to live (TTL) in milliseconds
 * @returns The function `isTTLExpired` returns a boolean value indicating whether the current time is
 * less than the provided time-to-live (TTL) value.
 */
export const isTTLExpired = (ttl: number) => {
  return Date.now() < ttl;
};
