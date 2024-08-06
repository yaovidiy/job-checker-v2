import { Role } from "@prisma/client"; 
import { redirect, type ServerLoadEvent } from "@sveltejs/kit"

export async function load(event: ServerLoadEvent) {
  if (event.locals.user?.role !== Role.ADMIN) {
    redirect(302, "/");
  }

  return {
    username: event.locals.user?.username
  }
}