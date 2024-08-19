import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { Prisma } from '@prisma/client';

type Feed = Prisma.FeedGetPayload<{
  include: {
    feedItems: false;
  }
}>;

export async function GET({ locals }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  try {
    const userFeeds = await db.feed.findMany({
      where: {
        userId: locals.user.id
      },
    });

    const groupedFeeds = userFeeds.reduce<Record<string, Feed[]>>((acc, feed) => {
      if (!acc[feed.feedUrl]) {
        acc[feed.feedUrl] = [];
      }
      acc[feed.feedUrl].push(feed);
      return acc;
    }, {});
    return json(groupedFeeds);
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}