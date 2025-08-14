import { Form, Link } from "@remix-run/react";

type HeaderProps = {
  appName?: string;
  userEmail?: string | null;
};

export default function Header({ appName = "Notes", userEmail }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/app" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-[#1976d2]" />
          <span className="text-lg font-semibold text-gray-900">{appName}</span>
        </Link>
        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">{userEmail}</span>
              <Form method="post" action="/logout">
                <button
                  className="rounded-md bg-[#1976d2] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#155a9c] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
                  type="submit"
                >
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[#1976d2] hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-[#1976d2] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#155a9c]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
