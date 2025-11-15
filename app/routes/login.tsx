import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createAuthSession, getSession } from "~/lib/authUtils";

export async function loader({ request }: LoaderFunctionArgs) {
  // If already authenticated, redirect to app
  const session = await getSession(request);
  if (session.get("authenticated")) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  // Validate credentials
  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPassword = process.env.AUTH_PASSWORD;

  if (username !== expectedUsername || password !== expectedPassword) {
    return Response.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  // Create session and redirect
  const sessionCookie = await createAuthSession(username);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": sessionCookie,
    },
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Get redirectTo from URL search params
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const redirectTo = urlParams?.get("redirectTo") || "/";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Medical Billing App
        </h1>
        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {actionData.error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              autoFocus
              className="w-full"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="w-full"
              placeholder="Enter password"
            />
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
