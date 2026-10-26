"use client";

// Preview-only data store: everything lives in this browser's localStorage.
// shortcut: no login and no shared data; swap these functions for Supabase calls (with Supabase Auth) when going live.
import { useEffect, useState } from "react";
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

function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function addDemoLead(lead: Lead) {
  const s = read();
  const row: AdminLead = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new", notes: "" };
  write({ ...s, leads: [row, ...s.leads] });
}

export function useStore() {
  const [store, setStore] = useState<Store | null>(null);
  // localStorage only exists after mount
  useEffect(() => setStore(read()), []);

  const update = (fn: (s: Store) => Store) =>
    setStore((prev) => {
      const next = fn(prev ?? read());
      write(next);
      return next;
    });

  const reset = () => {
    const s = seed(SAMPLE);
    write(s);
    setStore(s);
  };

  return { store, update, reset };
}
