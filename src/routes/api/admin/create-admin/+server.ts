import { error, json, type RequestEvent } from "@sveltejs/kit";
import { validateEmail, validatePassword } from "$lib/utils/general";
import { db } from "$lib/server/db/db";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { lucia } from "$lib/server/auth";
import { Role } from "@prisma/client";


export async function POST(event: RequestEvent) {
  const body = await event.request.json();

  if (!body.email || !body.password) {
    return error(400, "Missing email or password");
  }

  if (!validateEmail(body.email)) {
    return error(400, "Invalid email");
  }

  if (!validatePassword(body.password)) {
    return error(400, "Invalid password");
  }

  if (body.password !== body.repeatPassword) {
    return error(400, "Passwords do not match");
  }

  try {
    const existingUser = await db.user.findFirst({
      where: {
        email: body.email
      }
    });

    const existingAdmin = await db.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });

    if (existingUser || existingAdmin) {
      return error(400, "Incorrect email or password");
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(body.password, {
      memoryCost: 65536,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1
    });

    await db.user.create({
      data: {
        id: userId,
        username: body.email.split("@")[0],
        email: body.email,
        password_hash: passwordHash,
        role: Role.ADMIN
      }
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });


    return json({
      success: true
    });
  } catch (e) {
    console.error(e);
    return error(500, "Server error");
  }
}