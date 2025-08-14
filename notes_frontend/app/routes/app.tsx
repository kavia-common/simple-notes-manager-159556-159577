import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/sessions.server";
import Header from "~/components/Header";
import NoteList from "~/components/NoteList";
import { NotesProvider, useNotes } from "~/context/NotesContext";

/**
 * PUBLIC_INTERFACE
 * Loader ensures authentication and exposes the user to the route.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  /** Requires a logged-in user for this route. */
  const user = await requireUser(request);
  return json({ user });
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header appName="Notes" userEmail={user.email} />
      <NotesProvider userId={user.email}>
        <MainLayout />
      </NotesProvider>
    </div>
  );
}

function MainLayout() {
  const navigate = useNavigate();
  const { createNote } = useNotes();

  const handleCreate = () => {
    const note = createNote({ title: "New note" });
    navigate(`/app/notes/${note.id}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-4">
      <div className="hidden w-80 shrink-0 md:block">
        <div className="h-[calc(100vh-120px)] overflow-hidden rounded-xl border border-gray-200">
          <NoteList />
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-120px)] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200">
        <Outlet />
      </div>

      {/* Floating Action Button */}
      <button
        title="Add note"
        onClick={handleCreate}
        className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1976d2] text-white shadow-lg transition hover:bg-[#155a9c] focus:outline-none focus:ring-4 focus:ring-[#ffeb3b]"
        aria-label="Add note"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
