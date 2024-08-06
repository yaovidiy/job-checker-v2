import { db } from "$lib/server/db/db"
import { json, error, type RequestEvent } from "@sveltejs/kit"

export async function GET(event: RequestEvent): Promise<Response> {

  if (event.locals?.user?.role !== "ADMIN") {
    return error(403, { message: "Not authorized" })
  }

  try {
    const users = await db.user.findMany({
      select: {
        username: true,
        email: true,
        role: true,
        is_blocked: true
      },
      orderBy: { username: "asc" }
    })

    return json(users)
  } catch (err) {
    console.error(err)
    return error(500, { message: "Error fetching users" })
  }

}