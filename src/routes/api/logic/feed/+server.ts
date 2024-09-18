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

type FeedResult = {
  jobsDataArray: jobItem[];
  totalAmount: string;
}

function addItemSource(item: jobItem, source: string): jobItem & { source: string } {
  return { ...item.generalInfo, ...item.additionalInfo, ...item.analitics, ...{ scrore: item.score }, source };
}

export async function GET({ locals, url, fetch }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  try {
    const searchTerm = url.searchParams.get('search');

    const djinniFeeds = await fetch('/api/logic/scrapper/djinni/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search: searchTerm })
    });

    const rabotaFeeds = await fetch('/api/logic/scrapper/rabota/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search: searchTerm })
    });

    const workFeeds = await fetch('/api/logic/scrapper/work/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search: searchTerm })
    });

    const douFeeds = await fetch('/api/logic/scrapper/dou/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search: searchTerm })
    });

    if (!djinniFeeds.ok && !rabotaFeeds.ok && !workFeeds.ok && !douFeeds.ok) {
      throw new Error('Can\t fetch any feeds');
    }

    let djinniData: FeedResult = {
      jobsDataArray: [],
      totalAmount: '0'
    };
    let rabotaData: FeedResult = {
      jobsDataArray: [],
      totalAmount: '0'
    };
    let workData: FeedResult = {
      jobsDataArray: [],
      totalAmount: '0'
    };
    let douData: FeedResult = {
      jobsDataArray: [],
      totalAmount: '0'
    };

    if (djinniFeeds.ok) {
      djinniData = await djinniFeeds.json();
    }

    if (rabotaFeeds.ok) {
      rabotaData = await rabotaFeeds.json();
    }

    if (workFeeds.ok) {
      workData = await workFeeds.json();
    }

    if (douFeeds.ok) {
      douData = await douFeeds.json();
    }

    const feeds = [...djinniData.jobsDataArray.map((item) => addItemSource(item, 'djinni')), ...rabotaData.jobsDataArray.map((item) => addItemSource(item, 'rabota')), ...workData.jobsDataArray.map((item) => addItemSource(item, 'work')), ...douData.jobsDataArray.map((item) => addItemSource(item, 'dou'))];

    const sortedFeeds = feeds.sort((a, b) => b.score - a.score);
    const totalAmounts = [
      {
        source: 'djinni',
        totalAmount: djinniData.totalAmount
      },
      {
        source: 'rabota',
        totalAmount: rabotaData.totalAmount
      },
      {
        source: 'work',
        totalAmount: workData.totalAmount
      },
      {
        source: 'dou',
        totalAmount: douData.totalAmount
      }
    ];

    return json({ feeds: sortedFeeds, totalAmounts });
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
          postDate: postDate,
          pubSalaryMin: parseInt(job.generalInfo.pubSalary?.min ?? '0'),
          pubSalaryMax: parseInt(job.generalInfo.pubSalary?.max ?? '0'),
          shortDescription: job.generalInfo.shortDescription,
          reviewCount: parseInt(job.analitics.reviews ?? '0'),
          appliesCount: parseInt(job.analitics.applies ?? '0'),
          isApplied: job.analitics.isApplied,
          link: job.generalInfo.link,
          location: job.additionalInfo.location,
          experience: job.additionalInfo.experience,
          score: job.score
        },
        update: {
          title: job.generalInfo.title,
          description: sanitizeHTML(job.generalInfo.description),
          postDate: postDate,
          pubSalaryMin: parseInt(job.generalInfo.pubSalary?.min ?? '0'),
          pubSalaryMax: parseInt(job.generalInfo.pubSalary?.max ?? '0'),
          shortDescription: job.generalInfo.shortDescription,
          reviewCount: parseInt(job.analitics.reviews ?? '0'),
          appliesCount: parseInt(job.analitics.applies ?? '0'),
          isApplied: job.analitics.isApplied,
          link: job.generalInfo.link,
          location: job.additionalInfo.location,
          experience: job.additionalInfo.experience,
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
