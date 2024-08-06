import { db } from "$lib/server/db/db"
import { json, error, type RequestEvent } from "@sveltejs/kit"

export async function PUT(event: RequestEvent): Promise<Response> {

  if (event.locals?.user?.role !== "ADMIN") {
    return error(403, { message: "Not authorized" })
  }

  const { username, role, isBlocked } = await event.request.json();

  if (!username || !role) {
    return error(400, { message: "Missing username or role" })
  }

  try {
    await db.user.update({
      where: { username },
      data: { role, is_blocked: isBlocked }
    })

    return json({ message: "User updated" })
  } catch (err) {
    console.error(err)
    return error(500, { message: "Error updating user" })
  }

}