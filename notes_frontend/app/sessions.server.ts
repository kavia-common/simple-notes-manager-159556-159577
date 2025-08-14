import { createCookieSessionStorage, redirect } from "@remix-run/node";

type UserSession = {
  email: string;
  name?: string | null;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  // Not throwing to keep local dev working, but warn clearly.
  console.warn(
    "SESSION_SECRET is not set. Using an insecure development fallback. Set SESSION_SECRET in your environment for production."
  );
}

const isProd = process.env.NODE_ENV === "production";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__notes_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret || "dev-insecure-secret"],
    secure: isProd,
  },
});

/**
 * PUBLIC_INTERFACE
 * Get the current session from the request's cookies.
 */
export async function getUserSession(request: Request) {
  /** Returns the session object extracted from the incoming request cookies. */
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

/**
 * PUBLIC_INTERFACE
 * Returns the user object from the current session or null if not authenticated.
 */
export async function getUser(request: Request): Promise<UserSession | null> {
  /** Gets the authenticated user stored in the cookie session. Returns null if not found. */
  const session = await getUserSession(request);
  const user = session.get("user") as UserSession | undefined;
  return user || null;
}

/**
 * PUBLIC_INTERFACE
 * Ensures a user is logged in. Redirects to /login if not.
 */
export async function requireUser(
  request: Request
): Promise<UserSession> {
  /** Checks for a user in the session and throws a redirect to /login if not present. */
  const user = await getUser(request);
  if (!user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}

/**
 * PUBLIC_INTERFACE
 * Logs a user in by storing their info in the session and committing the cookie.
 */
export async function login(request: Request, user: UserSession, redirectTo = "/app") {
  /** Creates an authenticated session cookie for the provided user and redirects to redirectTo. */
  const session = await getUserSession(request);
  session.set("user", user);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

/**
 * PUBLIC_INTERFACE
 * Logs out the current user by destroying the session cookie and redirecting to /login.
 */
export async function logout(request: Request) {
  /** Clears the authentication session cookie and redirects to /login. */
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

/**
 * PUBLIC_INTERFACE
 * Commits the session and returns set-cookie header value.
 */
export async function commitSession(session: Awaited<ReturnType<typeof getUserSession>>) {
  /** Helper to manually commit session changes and get the Set-Cookie header value. */
  return sessionStorage.commitSession(session);
}

/**
 * PUBLIC_INTERFACE
 * Destroys the session and returns set-cookie header value.
 */
export async function destroySession(session: Awaited<ReturnType<typeof getUserSession>>) {
  /** Helper to manually destroy session and get the Set-Cookie header value. */
  return sessionStorage.destroySession(session);
}
