// routes/signup/+page.server.ts
import { lucia } from "$lib/server/auth";
import { error, json } from "@sveltejs/kit";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { db } from "$lib/server/db/db";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<Response> {
  const body = await event.request.json();

  const { username, password, rePassword } = body;
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return error(400, {
      message: "Invalid username"
    });
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 255 || rePassword !== password) {
    return error(400, {
      message: "Invalid password"
    });
  }

  const alreadyExistUser = await db.user.findFirst({
    where: {
      username: username
    }
  });

  if (alreadyExistUser !== null) {
    return error(400, { message: 'Invalid username' })
  }

  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  await db.user.create({
    data: {
      id: userId,
      username: username,
      email: username,
      password_hash: passwordHash
    }
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  event.cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes
  });

  return json({ success: true })
}