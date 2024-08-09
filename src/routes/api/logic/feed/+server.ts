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

export async function POST({ locals, request }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  const body = await request.json();

  try {
    const existingFeed = await db.feed.findFirst({
      where: {
        userId: locals.user.id,
        feedUrl: body.url
      },
      include: {
        feedItems: true
      }
    });

    if (existingFeed && existingFeed.updatedAt) {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const updatedAt = new Date(existingFeed.updatedAt);

      if (updatedAt > twoDaysAgo) {
        return json(existingFeed);
      }
    }

    const fetchedFeedResponse = await fetch('/api/scrapper/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: body.url })
    });

    if (!fetchedFeedResponse.ok) {
      return error(500, 'Internal server error');
    }

    const fetchedFeedData = await fetchedFeedResponse.json();

    const feed = await db.feed.upsert({
      where: {
        userId_feedUrl: {
          userId: locals.user.id,
          feedUrl: body.url
        }
      },
      update: {
        feedData: fetchedFeedData,
        updatedAt: new Date()
      },
      create: {
        userId: locals.user.id,
        feedUrl: body.url,
        feedData: fetchedFeedData
      }
    });

    return json(feed);
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}