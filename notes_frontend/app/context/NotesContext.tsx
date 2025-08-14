import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Note } from "~/data/notes.client";
import { createNoteId, loadNotesForUser, saveNotesForUser } from "~/data/notes.client";

type NotesContextValue = {
  userId: string;
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // CRUD
  listNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
  createNote: (initial?: Partial<Pick<Note, "title" | "content">>) => Note;
  updateNote: (id: string, updates: Partial<Pick<Note, "title" | "content">>) => void;
  deleteNote: (id: string) => void;

  // Helpers
  searchNotes: (query: string) => Note[];
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

type ProviderProps = {
  userId: string;
  children: React.ReactNode;
};

/**
 * PUBLIC_INTERFACE
 * React provider encapsulating notes state and operations (CRUD + search).
 */
export function NotesProvider({ userId, children }: ProviderProps) {
  /** Provides a per-user notes store backed by localStorage. */
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load notes on mount for the current user
  useEffect(() => {
    if (!userId) return;
    const loaded = loadNotesForUser(userId);
    setNotes(loaded);
  }, [userId]);

  // Persist notes when changed
  useEffect(() => {
    if (!userId) return;
    saveNotesForUser(userId, notes);
  }, [userId, notes]);

  /**
   * PUBLIC_INTERFACE
   * Returns all notes sorted by updatedAt desc.
   */
  const listNotes = useCallback(() => {
    /** Returns notes sorted by most recently updated first. */
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  /**
   * PUBLIC_INTERFACE
   * Returns a note by id, or undefined if not found.
   */
  const getNoteById = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes]
  );

  /**
   * PUBLIC_INTERFACE
   * Creates a new note and returns it.
   */
  const createNote = useCallback(
    (initial?: Partial<Pick<Note, "title" | "content">>) => {
      /** Creates and stores a new note with optional initial title/content. */
      const now = Date.now();
      const note: Note = {
        id: createNoteId(),
        title: initial?.title?.trim() || "Untitled",
        content: initial?.content || "",
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    []
  );

  /**
   * PUBLIC_INTERFACE
   * Updates a note's title/content by id.
   */
  const updateNote = useCallback((id: string, updates: Partial<Pick<Note, "title" | "content">>) => {
    /** Updates properties of an existing note and refreshes updatedAt. */
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title: updates.title !== undefined ? updates.title : n.title,
              content: updates.content !== undefined ? updates.content : n.content,
              updatedAt: Date.now(),
            }
          : n
      )
    );
  }, []);

  /**
   * PUBLIC_INTERFACE
   * Deletes a note by id.
   */
  const deleteNote = useCallback((id: string) => {
    /** Removes a note from the store by id. */
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * PUBLIC_INTERFACE
   * Filters notes by query on title/content.
   */
  const searchNotes = useCallback(
    (query: string) => {
      /** Performs case-insensitive search across title and content. */
      const q = query.trim().toLowerCase();
      if (!q) return listNotes();
      return listNotes().filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    },
    [listNotes]
  );

  const value = useMemo<NotesContextValue>(
    () => ({
      userId,
      notes,
      searchQuery,
      setSearchQuery,
      listNotes,
      getNoteById,
      createNote,
      updateNote,
      deleteNote,
      searchNotes,
    }),
    [userId, notes, searchQuery, listNotes, getNoteById, createNote, updateNote, deleteNote, searchNotes]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access the notes store and operations.
 */
export function useNotes(): NotesContextValue {
  /** Returns the notes context or throws if used outside of NotesProvider. */
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return ctx;
}
