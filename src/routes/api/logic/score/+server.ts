import type { RequestEvent } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { generateIdFromEntropySize } from "lucia";
import { db } from "$lib/server/db/db";
import { type userScore } from '@prisma/client';

export async function GET(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const score = await db.userScore.findFirst({
      where: {
        userId: event.locals.user.id
      }
    })

    if (!score) {
      return error(404, "Not found");
    }

    return json(score);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function POST(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  const body: Omit<userScore, 'userId' | 'id'> = await event.request.json();

  const generateId = generateIdFromEntropySize(10);

  try {
    const score = await db.userScore.create({
      data: {
        id: generateId,
        userId: event.locals.user.id,
        ...body
      }
    });

    return json(score);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function PATCH(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  const body: Omit<userScore, 'userId' | 'createdAt'> = await event.request.json();

  try {
    const score = await db.userScore.update({
      where: {
        userId: event.locals.user.id
      },
      data: {
        ...body
      }
    });

    return json(score);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}

export async function DELETE(event: RequestEvent) {
  if (!event.locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const score = await db.userScore.delete({
      where: {
        userId: event.locals.user.id
      }
    });

    return json(score);
  } catch (err) {
    console.log(err);
    return error(500, "Internal server error");
  }
}
