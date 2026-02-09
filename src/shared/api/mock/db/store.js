import { seedAll } from "./seed.js";
import { dbChanged } from "../utils/events.js";

const KEY = "ps_mock_state_v1";

let state = load() || seedAll();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function db() {
  return state;
}

/**
 * Call this after ANY mutation.
 * payload example: { entity:"products", action:"create", id:"p1" }
 */
export function persist(payload = { entity: "db", action: "change" }) {
  save();
  dbChanged(payload);
}
