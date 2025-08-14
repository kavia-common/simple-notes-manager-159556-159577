import { Form, Link, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getUser, login } from "~/sessions.server";

/**
 * PUBLIC_INTERFACE
 * Loader redirects to /app if user already authenticated.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  /** If a user is already logged in, redirect to /app, otherwise render register. */
  const user = await getUser(request);
  if (user) return redirect("/app");
  return json({});
}

/**
 * PUBLIC_INTERFACE
 * Action creates a session for the new "user" (demo only).
 */
export async function action({ request }: ActionFunctionArgs) {
  /** Accepts name, email, password and logs the user in (no backend persistence, demo). */
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const name = String(form.get("name") || "").trim();
  const password = String(form.get("password") || "").trim();
  const redirectTo = String(form.get("redirectTo") || "/app");

  if (!email || !password) {
    return json({ error: "Name, email and password are required." }, { status: 400 });
  }

  return login(request, { email, name }, redirectTo);
}

export default function Register() {
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/app";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded bg-[#1976d2]" />
          <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">Your notes, organized.</p>
        </div>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1976d2] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#1976d2] px-4 py-2 text-sm font-medium text-white hover:bg-[#155a9c] focus:outline-none focus:ring-2 focus:ring-[#ffeb3b]"
          >
            Sign up
          </button>
        </Form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1976d2] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
