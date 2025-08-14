import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { useNotes } from "~/context/NotesContext";

export default function NoteById() {
  const params = useParams();
  const navigate = useNavigate();
  const { getNoteById, updateNote, deleteNote } = useNotes();
  const noteId = params.id || "";

  const note = useMemo(() => getNoteById(noteId), [getNoteById, noteId]);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100" />
          <h2 className="text-lg font-semibold text-gray-900">Note not found</h2>
          <p className="mt-2 text-sm text-gray-600">The requested note does not exist.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateNote(noteId, { title: title.trim(), content });
  };

  const handleDelete = () => {
    const ok = window.confirm("Delete this note? This action cannot be undone.");
    if (!ok) return;
    deleteNote(noteId);
    navigate("/app");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <input
          className="w-full max-w-xl rounded-md border border-gray-200 bg-white px-3 py-2 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <div className="ml-3 flex items-center gap-2">
          <button
            onClick={handleSave}
            className="rounded-md bg-[#1976d2] px-3 py-2 text-sm font-medium text-white hover:bg-[#155a9c] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <textarea
          className="h-full min-h-[50vh] w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
        />
      </div>
      <div className="border-t border-gray-200 px-4 py-2 text-right text-xs text-gray-500">
        Last edited: {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
