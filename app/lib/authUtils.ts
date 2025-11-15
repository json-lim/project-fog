import { createCookieSessionStorage } from "@remix-run/node";

// Create a session storage using cookies
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth_session",
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    sameSite: "lax", // CSRF protection
    secrets: [process.env.SESSION_SECRET || "change-me-in-production"],
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

/**
 * Get the current session from the request
 */
export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

/**
 * Create a session with authentication data
 */
export async function createAuthSession(username: string) {
  const session = await sessionStorage.getSession();
  session.set("authenticated", true);
  session.set("username", username);

  return sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Destroy the current session (logout)
 */
export async function destroySession(request: Request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}

/**
 * Verify if user is authenticated
 * Throws 401 Response if not authenticated
 */
export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const authenticated = session.get("authenticated");

  if (!authenticated) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return {
    authenticated: true,
    username: session.get("username") as string,
  };
}
