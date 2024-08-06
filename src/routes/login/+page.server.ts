// routes/login/+page.server.ts
import { redirect } from "@sveltejs/kit";

import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load(event: ServerLoadEvent) {
  if (event.locals.user) {
    redirect(301, '/')
  }
}