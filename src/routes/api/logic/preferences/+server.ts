import type { RequestEvent } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { generateIdFromEntropySize } from "lucia";
import { db } from "$lib/server/db/db";
import { type userPreferences } from '@prisma/client';

export async function GET(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const preferenses = await db.userPreferences.findFirst({
      where: {
        userId: event.locals.user.id
      }
    })

    if (!preferenses) {
      return error(404, "Not found");
    }

    return json(preferenses);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function POST(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  const body: Omit<userPreferences, 'userId' | 'id'> = await event.request.json();

  const generateId = generateIdFromEntropySize(10);

  try {
    const preferenses = await db.userPreferences.create({
      data: {
        id: generateId,
        userId: event.locals.user.id,
        ...body
      }
    });

    return json(preferenses);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function PATCH(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  const body: Omit<userPreferences, 'userId' | 'createdAt'> = await event.request.json();
  const updateObject = {
    djinniSessionCookie: body.djinniSessionCookie,
    douSessionCookie: body.douSessionCookie
  };

  try {
    const preferenses = await db.userPreferences.update({
      where: {
        id: body.id
      },
      data: updateObject
    });

    return json(preferenses);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function DELETE(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  const body = await event.request.json();

  try {
    const preferenses = await db.userPreferences.delete({
      where: {
        id: body.id
      }
    });

    return json(preferenses);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}