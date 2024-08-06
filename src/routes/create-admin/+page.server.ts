import { Role } from "@prisma/client";
import { db } from "$lib/server/db/db";
import { redirect, type ServerLoadEvent } from "@sveltejs/kit";

export async function load(event: ServerLoadEvent) {
  const existingAdmin = await db.user.findFirst({
    where: {
      role: "ADMIN"
    }
  });


  if (existingAdmin && event.locals.user?.role === Role.ADMIN) {
    return redirect(302, "/admin");
  }

  if (existingAdmin && event.locals.user?.role !== Role.ADMIN) {
    return redirect(302, "/login");
  }

  return {};
}