import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import type { jobItem } from '$lib/types';
import { sanitizeHTML } from '$lib/utils/sanitizeHtml';


export async function GET({ locals, url }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  const feedId = url.searchParams.get('feedId');

  if (!feedId) {
    return error(400, 'Bad request');
  }

  try {
    const feeds = await db.feed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        feedItems: true
      }
    });

    return json(feeds);
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}

export async function POST({ locals, request, fetch }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  const body = await request.json();

  try {
    const existingFeed = await db.feed.findFirst({
      where: {
        userId: locals.user.id,
        feedUrl: body.url,
        feedPage: body.page ?? 1
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
        return json({ feedId: existingFeed.id });
      }
    }

    const fetchedFeedResponse = await fetch('/api/logic/scrapper/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: body.url, page: body.page })
    });

    if (!fetchedFeedResponse.ok) {
      return error(500, 'Internal server error');
    }

    const fetchedFeedData: { jobsDataArray: jobItem[]; totalAmount: string } = await fetchedFeedResponse.json();

    console.log(fetchedFeedData, 'fetchedFeedData');

    if (fetchedFeedData.jobsDataArray.length === 0) {
      return error(404, 'No jobs found');
    }

    const feed = await db.feed.create({
      data: {
        feedUrl: body.url,
        feedPage: body.page ?? 1,
        userId: locals.user.id
      }
    });

    await db.feedItem.createMany({
      data: fetchedFeedData.jobsDataArray.map((job) => ({
        feedId: feed.id,
        title: job.generalInfo.title,
        description: sanitizeHTML(job.generalInfo.description),
        companyName: job.generalInfo.companyName,
        postDate: job.generalInfo.postDate,
        pubSalaryMin: parseInt(job.generalInfo.pubSalary?.min ?? '0'),
        pubSalaryMax: parseInt(job.generalInfo.pubSalary?.max ?? '0'),
        shortDescription: job.generalInfo.shortDescription,
        reviewCount: parseInt(job.analitics.reviews ?? '0'),
        appliesCount: parseInt(job.analitics.applies ?? '0'),
        isApplied: job.analitics.isApplied,
        link: job.generalInfo.link,
        location: job.additionalInfo.location,
        typeOfJob: job.additionalInfo.typeOfJob,
        experience: job.additionalInfo.experience,
        englishLevel: job.additionalInfo.english,
        score: job.score
      }))
    });

    return json({ feedId: feed.id });
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}
