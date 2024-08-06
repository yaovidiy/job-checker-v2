// routes/login/github/callback/+server.ts
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { github, lucia } from "$lib/server/auth";
import { db } from "$lib/server/db/db";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db.user.findUnique({
      where: {
        email: githubUser.email
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
          provider: "github"
        }
      });

      if (!existingUserProvider) {
        await db.authProviders.create({
          data: {
            userId: existingUser.id,
            provider: "github"
          }
        });
      }
    } else {
      const userId = generateIdFromEntropySize(10); // 16 characters long

      await db.$transaction([
        db.user.create({
          data: {
            id: userId,
            username: githubUser.login,
            email: githubUser.email,
          }
        }),
        db.authProviders.create({
          data: {
            userId,
            provider: "github"
          }
        })
      ]);

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    console.log(e);

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
  email: string;
}