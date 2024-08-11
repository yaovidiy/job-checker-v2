import type { RequestEvent } from "../$types";
import { redirect } from "@sveltejs/kit";
import { Role } from "@prisma/client"

export async function load({ locals }: RequestEvent) {
  if (locals.user?.role !== Role.ADMIN) {
    return redirect(302, '/');
  }
}