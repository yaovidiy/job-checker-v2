// routes/login/github/callback/+server.ts
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { google, lucia } from "$lib/server/auth";
import { db } from "$lib/server/db/db";
import { error, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");

  const storedState = event.cookies.get("google_oauth_state");
  const storedCodeVerifier = event.cookies.get("google_oauth_code_verifier");

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return error(400, "Bad Request");
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

    const googleUser = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });

    if (!googleUser.ok) {
      console.error(googleUser);

      return error(googleUser.status, "Internal Server Error");
    }

    const user = await googleUser.json();

    const existingUser = await db.user.findUnique({
      where: {
        email: user.email
      }
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });

      const existingUserProvider = await db.authProviders.findFirst({
        where: {
          userId: existingUser.id,
          provider: "google"
        }
      });

      if (!existingUserProvider) {
        await db.authProviders.create({
          data: {
            userId: existingUser.id,
            provider: "google",
          }
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/"
        }
      });
    }

    const userId = generateIdFromEntropySize(10);

    await db.user.create({
      data: {
        id: userId,
        username: user.email.split("@")[0],
        email: user.email,
      }
    });

    await db.authProviders.create({
      data: {
        userId,
        provider: "google",
      }
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      console.error(e);
      return error(400, "Bad Request");
    }

    console.error(e);
    return error(500, "Internal Server Error");
  }
}