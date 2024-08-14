import { db } from "$lib/server/db/db";
import { type userScore } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";

export async function GET({ locals }: RequestEvent) {
  if (!locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const userScores: userScore[] = await db.userScore.findMany({
      where: {
        userId: locals.user.id,
      },
    });

    return json(userScores);
  } catch (e) {
    console.error(e);
    return error(500, "Internal server error");
  }
}

export async function POST({ locals, request }: RequestEvent) {
  if (!locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const body = await request.json();

    console.log(body);

    if (!body.scores || body.scores.length === 0) {
      return error(400, "Bad request");
    }

    const userScores = await db.userScore.createMany({
      data: body.scores.map((score: { searchValue: string; score: number }) => ({
        ...score,
        userId: locals?.user?.id,
      })),
    });

    return json(userScores);
  } catch (e) {
    console.error(e, 'user/score/+server.ts');
    return error(500, "Internal server error");
  }
}

export async function DELETE({ locals, request }: RequestEvent) {
  if (!locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return error(400, "Bad request");
    }

    const deleteScore = await db.userScore.deleteMany({
      where: {
        id: body.id,
      },
    });

    return json(deleteScore);
  } catch (e) {
    console.error(e);
    return error(500, "Internal server error");
  }
}

export async function PATCH({ locals, request }: RequestEvent) {
  if (!locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const body = await request.json();

    if (!body.id || !body.score || !body.searchValue) {
      return error(400, "Bad request");
    }

    const updateScore = await db.userScore.update({
      where: {
        id: body.id,
      },
      data: {
        score: body.score,
        searchValue: body.searchValue,
      },
    });

    return json(updateScore);
  } catch (e) {
    console.error(e);
    return error(500, "Internal server error");
  }
}