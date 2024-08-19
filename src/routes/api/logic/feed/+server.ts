import { json, error, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import type { jobItem } from '$lib/types';
import { Prisma } from '@prisma/client';
import { sanitizeHTML } from '$lib/utils/sanitizeHtml';

type Feed = Prisma.FeedGetPayload<{
  include: {
    feedItems: false;
  };
}>;

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
        feedItems: {
          orderBy: {
            postDate: 'desc'
          }
        }
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
      }
    });

    if (existingFeed && existingFeed.updatedAt && !body.forceUpdate) {
      const updateTimeOut = new Date();
      updateTimeOut.setDate(updateTimeOut.getDate() - 1);
      const updatedAt = new Date(existingFeed.updatedAt);

      if (updatedAt > updateTimeOut) {
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

    if (fetchedFeedData.jobsDataArray.length === 0) {
      return error(404, 'No jobs found');
    }

    let feed: Feed;

    if (!existingFeed) {
      feed = await db.feed.create({
        data: {
          feedUrl: body.url,
          feedPage: body.page ?? 1,
          userId: locals.user.id,
          totalItemsAmount: parseInt(fetchedFeedData.totalAmount)
        }
      });
    } else {
      await db.feed.update({
        where: {
          id: existingFeed.id
        },
        data: {
          totalItemsAmount: parseInt(fetchedFeedData.totalAmount)
        }
      });
      feed = existingFeed;
    }
    const saveOrUpdateFeedItems = fetchedFeedData.jobsDataArray.map((job) => {
      const postDate = new Date(job.generalInfo.postDate.split(' ')[1].split('.').reverse().join('-') + 'T' + job.generalInfo.postDate.split(' ')[0]);
      postDate.setUTCHours(postDate.getUTCHours() + 3);
      return db.feedItem.upsert({
        where: {
          link: job.generalInfo.link
        },
        create: {
          feedId: feed.id,
          title: job.generalInfo.title,
          description: sanitizeHTML(job.generalInfo.description),
          companyName: job.generalInfo.companyName,
          postDate: postDate,
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
        },
        update: {
          title: job.generalInfo.title,
          description: sanitizeHTML(job.generalInfo.description),
          companyName: job.generalInfo.companyName,
          postDate: postDate,
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
        }
      });
    });

    const savedOrUpdatedPromises = await Promise.allSettled(saveOrUpdateFeedItems);

    const errors = savedOrUpdatedPromises.filter((promise) => promise.status === 'rejected');

    if (errors.length > 0) {
      return error(500, 'Internal server error');
    }

    return json({ feedId: feed.id });
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error');
  }
}
