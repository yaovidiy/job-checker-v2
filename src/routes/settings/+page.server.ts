import { redirect, type ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals }: ServerLoadEvent) {
  if (!locals.user) {
    return redirect(302, "/");
  }

  return {};
}