"use client";

// Preview-only data store: everything lives in this browser's localStorage.
// shortcut: no login and no shared data; swap these functions for Supabase calls (with Supabase Auth) when going live.
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, seed, type AdminLead, type Store } from "./admin";
import { SAMPLE } from "./inventory";
import type { Lead } from "./lead";

const KEY = "a1-admin-demo-v1";

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { ...s, settings: { ...DEFAULT_SETTINGS, ...s.settings } };
    }
  } catch {}
  return seed(SAMPLE);
}

/** False when the browser refuses the write (usually storage full from photos). */
function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function addDemoLead(lead: Lead) {
  const s = read();
  const row: AdminLead = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new", notes: "" };
  write({ ...s, leads: [row, ...s.leads] });
}

export function useStore() {
  const [store, setStore] = useState<Store | null>(null);
  const latest = useRef<Store | null>(null);
  // localStorage only exists after mount
  useEffect(() => {
    latest.current = read();
    setStore(latest.current);
  }, []);

  /** Applies and saves a change; returns false (and changes nothing) if it couldn't be saved. */
  const update = (fn: (s: Store) => Store) => {
    const next = fn(latest.current ?? read());
    if (!write(next)) return false;
    latest.current = next;
    setStore(next);
    return true;
  };

  const reset = () => {
    const s = seed(SAMPLE);
    write(s);
    latest.current = s;
    setStore(s);
  };

  return { store, update, reset };
}
