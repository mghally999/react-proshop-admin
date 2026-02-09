// src/shared/lib/id.js

export function uid(prefix = "id") {
  const rand = Math.random().toString(16).slice(2, 8);
  const ts = Date.now().toString(16);
  return `${prefix}${ts}${rand}`;
}
