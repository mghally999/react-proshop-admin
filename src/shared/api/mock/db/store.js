import { seedMedia, seedProducts, seedUsers } from "./seed.js";

const KEY = "ps_mock_state_v1";

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function buildInitial() {
  return {
    version: 1,
    users: seedUsers(),
    products: seedProducts(),
    media: seedMedia(),
    transactions: [],
    invoices: [],
    audit: [],
    notifications: [],
  };
}

let _state = null;

export function db() {
  if (_state) return _state;

  const raw = localStorage.getItem(KEY);
  const v = raw ? safeParse(raw, null) : null;

  _state = v || buildInitial();

  // harden arrays (fixes "state.media.filter is not a function")
  _state.users = Array.isArray(_state.users) ? _state.users : [];
  _state.products = Array.isArray(_state.products) ? _state.products : [];
  _state.media = Array.isArray(_state.media) ? _state.media : [];
  _state.transactions = Array.isArray(_state.transactions)
    ? _state.transactions
    : [];
  _state.invoices = Array.isArray(_state.invoices) ? _state.invoices : [];
  _state.audit = Array.isArray(_state.audit) ? _state.audit : [];
  _state.notifications = Array.isArray(_state.notifications)
    ? _state.notifications
    : [];

  return _state;
}

export function persist() {
  localStorage.setItem(KEY, JSON.stringify(db()));
}

export function resetMockDb() {
  _state = buildInitial();
  persist();
  return _state;
}
