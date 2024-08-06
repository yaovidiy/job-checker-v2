import { generateCodeVerifier, generateState } from "arctic";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import { google } from "$lib/server/auth";


export async function GET(event: RequestEvent): Promise<Response> {
  const codeVerifier = generateCodeVerifier();
  const state = generateState();

  const url = await google.createAuthorizationURL(state, codeVerifier, { scopes: ["profile", "email"] });

  // store state verifier as cookie
  event.cookies.set("google_oauth_state", state, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10 // 10 min
  });

  // store code verifier as cookie
  event.cookies.set("google_oauth_code_verifier", codeVerifier, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10 // 10 min
  });

  redirect(302, url.toString());
}