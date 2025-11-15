import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession } from "~/lib/authUtils";

export async function action({ request }: ActionFunctionArgs) {
  const sessionCookie = await destroySession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": sessionCookie,
    },
  });
}

export async function loader() {
  return redirect("/login");
}
