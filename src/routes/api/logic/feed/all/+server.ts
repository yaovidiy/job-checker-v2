import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';

export async function GET({ locals }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  try {
    const feeds = await db.feed.findMany({
      where: {
        userId: locals.user.id
      }
    });

    return json(feeds);
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}