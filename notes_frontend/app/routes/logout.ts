import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/sessions.server";

/**
 * PUBLIC_INTERFACE
 * Loader simply redirects back to /app; logout should be a POST for CSRF safety.
 */
export async function loader() {
  /** Redirects to /app; logout should be triggered via POST action. */
  return redirect("/app");
}

/**
 * PUBLIC_INTERFACE
 * Action destroys the session and redirects to /login.
 */
export async function action({ request }: ActionFunctionArgs) {
  /** Clears session cookie and sends the user to the login page. */
  return logout(request);
}

export default function Logout() {
  return null;
}
