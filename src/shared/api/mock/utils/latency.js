export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Wrap any sync/async handler and add artificial latency.
 * Usage: export const list = withLatency(async () => {...}, { min: 120, max: 420 })
 */
export function withLatency(fn, opts = {}) {
  const min = Number.isFinite(opts.min) ? opts.min : 80;
  const max = Number.isFinite(opts.max) ? opts.max : 260;

  return async (...args) => {
    const delay = Math.floor(min + Math.random() * (max - min + 1));
    await sleep(delay);
    return fn(...args);
  };
}
