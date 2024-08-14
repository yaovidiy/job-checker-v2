import { db } from "$lib/server/db/db";
import { type userPreferences } from "@prisma/client";
import type { RequestEvent } from "./$types";
import { error, json } from "@sveltejs/kit";

export async function GET({ locals }: RequestEvent) {
  if (!locals.user) {
    return error(403, "Forbidden");
  }

  try {
    const userPreferences: userPreferences | null = await db.userPreferences.findFirst({
      where: {
        userId: locals.user.id,
      },
    });

    return json(userPreferences);
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

    if (!body.preferences) {
      return error(400, "Bad request");
    }

    const userPreferences = await db.userPreferences.create({
      data: {
        ...body.preferences,
        userId: locals?.user?.id,
      },
    });

    return json(userPreferences);
  } catch (e) {
    console.error(e);
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

    await db.userPreferences.delete({
      where: {
        id: body.id,
      },
    });

    return json({ success: true });
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

    if (!body.id || !body.preferences) {
      return error(400, "Bad request");
    }

    const updatePreferences = await db.userPreferences.update({
      where: {
        id: body.id,
      },
      data: {
        ...body.preferences,
      },
    });

    return json(updatePreferences);
  } catch (e) {
    console.error(e);
    return error(500, "Internal server error");
  }
}