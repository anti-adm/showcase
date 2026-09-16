/** Per-process backstop. Configure edge rate limiting for multi-instance deployments. */
export function createContactLimiter(limit = 5, windowMs = 15 * 60 * 1000, capacity = 2000) {
  const attempts = new Map<string, {count: number; until: number}>();
  return (key: string, now = Date.now()) => {
    for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry);
    const current = attempts.get(key);
    if (current && current.count >= limit) return Math.max(1, Math.ceil((current.until - now) / 1000));
    if (!current && attempts.size >= capacity) return 60;
    attempts.set(key, {count: (current?.count ?? 0) + 1, until: current?.until ?? now + windowMs});
    return 0;
  };
}
