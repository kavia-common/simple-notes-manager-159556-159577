import { NavLink } from "@remix-run/react";
import { useNotes } from "~/context/NotesContext";

export default function NoteList() {
  const { searchQuery, setSearchQuery, searchNotes, listNotes } = useNotes();
  const notes = searchQuery ? searchNotes(searchQuery) : listNotes();

  return (
    <aside className="flex h-full w-full flex-col">
      <div className="p-3">
        <label className="sr-only" htmlFor="search">
          Search notes
        </label>
        <div className="relative">
          <input
            id="search"
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="m20 20-3.5-3.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="#757575"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="mt-1 flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No notes found.</div>
        ) : (
          <ul className="px-2">
            {notes.map((n) => (
              <li key={n.id}>
                <NavLink
                  prefetch="intent"
                  to={`/app/notes/${n.id}`}
                  className={({ isActive }) =>
                    [
                      "block rounded-md px-3 py-2",
                      isActive ? "bg-blue-50 text-[#1976d2]" : "text-gray-800 hover:bg-gray-50",
                    ].join(" ")
                  }
                >
                  <div className="truncate text-sm font-medium">{n.title || "Untitled"}</div>
                  <div className="truncate text-xs text-gray-500">
                    {new Date(n.updatedAt).toLocaleString()}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
