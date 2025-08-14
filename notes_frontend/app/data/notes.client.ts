export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

const LS_PREFIX = "notes::";

/**
 * PUBLIC_INTERFACE
 * Loads notes for a given user from localStorage.
 */
export function loadNotesForUser(userId: string): Note[] {
  /** Returns an array of notes for the given userId from localStorage. */
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Note[];
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Saves notes for a given user to localStorage.
 */
export function saveNotesForUser(userId: string, notes: Note[]) {
  /** Persists the provided note array for the userId to localStorage. */
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_PREFIX + userId, JSON.stringify(notes));
  } catch {
    // ignore storage errors
  }
}

/**
 * PUBLIC_INTERFACE
 * Generates a unique ID for notes.
 */
export function createNoteId(): string {
  /** Creates a semi-unique id based on timestamp and random suffix. */
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
