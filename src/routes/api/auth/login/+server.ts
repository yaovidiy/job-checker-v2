// routes/auth/login/+server.ts
import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db/db";
import { lucia } from "$lib/server/auth";
import { verify } from "@node-rs/argon2";

import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
  const body = await event.request.json();

  const { username, password } = body;

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return error(400, {
      message: "Incorrect username or password"
    });
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return error(400, {
      message: "Incorrect username or password"
    });
  }

  const existingUser = await db.user.findFirst({
    where: {
      username: username
    }
  })

  if (!existingUser || !existingUser.password_hash) {

    return error(400, {
      message: "Incorrect username or password"
    });
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  if (!validPassword) {
    return error(400, {
      message: "Incorrect username or password"
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes
  });

  return json({ success: true });
}