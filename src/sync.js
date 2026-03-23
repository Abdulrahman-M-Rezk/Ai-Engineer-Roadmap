import FIREBASE_DB_URL from "./firebase-config.js";

const isConfigured = () =>
  FIREBASE_DB_URL && !FIREBASE_DB_URL.includes("YOUR_PROJECT_ID");

/** Generate a random 8-char ID */
export function generateId() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() +
         Math.random().toString(36).slice(2, 6).toUpperCase();
}

/** Save progress to Firebase */
export async function saveProgress(syncId, checked) {
  if (!isConfigured()) return { ok: false, reason: "not_configured" };
  try {
    const res = await fetch(
      `${FIREBASE_DB_URL}/progress/${syncId}.json`,
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checked, updatedAt: Date.now() }) }
    );
    return res.ok ? { ok: true } : { ok: false, reason: "fetch_error" };
  } catch {
    return { ok: false, reason: "network_error" };
  }
}

/** Load progress from Firebase */
export async function loadProgress(syncId) {
  if (!isConfigured()) return { ok: false, reason: "not_configured" };
  try {
    const res = await fetch(`${FIREBASE_DB_URL}/progress/${syncId}.json`);
    if (!res.ok) return { ok: false, reason: "fetch_error" };
    const data = await res.json();
    if (!data || !data.checked) return { ok: true, checked: {} };
    return { ok: true, checked: data.checked };
  } catch {
    return { ok: false, reason: "network_error" };
  }
}

export const configured = isConfigured;
