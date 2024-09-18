import { json, error, type RequestEvent } from '@sveltejs/kit';
import puppeteer, { type CookieParam } from 'puppeteer';
import { type jobItem } from '$lib/types';
import { db } from '$lib/server/db/db';
import * as cheerio from 'cheerio';
import type { userScore } from '@prisma/client';

export async function POST({ locals, request }: RequestEvent) {
  if (!locals.user) {
    return error(403, 'Forbidden');
  }

  // {
  //   executablePath: '/usr/bin/google-chrome',
  //   args: ['--no-sandbox'],
  // }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const body = await request.json();

  if (!body.search) {
    return error(400, 'Bad request');
  }

  try {


    const preferenses = await db.userPreferences.findFirst({
      where: {
        userId: locals.user.id
      }
    });

    const scores: userScore[] = await db.userScore.findMany({
      where: {
        userId: locals.user.id
      }
    });

    let SESSION_COOKIES_VALUE = '';

    if (preferenses) {
      SESSION_COOKIES_VALUE = preferenses.djinniSessionCookie;
    }

    // const pagination = body.page ?? 1;
    const cookie_sessionid: CookieParam = {
      name: 'sessionid',
      value: SESSION_COOKIES_VALUE,
      domain: '.djinni.co',
      path: '/',
      expires: new Date('2025-05-03T17:38:44.000Z').getTime(),
      priority: 'Medium',
      httpOnly: true,
      secure: true,
    }

    await page.setCookie(cookie_sessionid);
    await page.goto(`https://www.work.ua/`, {
      waitUntil: 'networkidle2',
    });

    await page.screenshot({ path: './static/work/initialScreen.png', fullPage: true });

    await page.type('#searchform input.form-control.jobseeker-search', body.search, { delay: 100 });

    await page.click('#searchform input.js-main-region.form-control');

    await page.click('#searchform ul.list-tips > li:nth-child(6)');

    await page.screenshot({ path: './static/work/fiiledInput.png', fullPage: true });

    await page.keyboard.press('Enter');

    await page.waitForSelector('#pjax-jobs-list');

    await page.screenshot({ path: './static/work/afterSearch.png', fullPage: true });

    const feedPage = await page.content();

    const $ = cheerio.load(feedPage);


    const totalAmount = $('#pjax-job-list > div:first-child > div:first-child > span').html()?.trim().split(' ')[0];
    const jobsElements = $('#pjax-jobs-list > div').toArray();
    const jobsDataArray: jobItem[] = [];

    jobsElements.forEach((job) => {
      const header = $(job).find('div.mb-lg');
      const descriptionEl = $(job).find('p');
      const titleLink = header.length > 1 ? header.eq(1).find('a') : header.find('a');
      const companyEl = $(job).find('div.mt-xs');
      const pubSalaryEl = $(job).find('div:not(.mt-xs) > span.strong-600');
      const footerEl = $(job).find('div:last-child');
      const postDateEl = footerEl.find('time');
      const locationEl = companyEl.find('span:not(.mr-xs, strong-600)');


      const salaryText = pubSalaryEl?.text()?.trim();
      const salaryMatch = salaryText?.match(/\d+/);
      const salary = salaryMatch ? salaryMatch[0] : '0';
      const minPubSalary = salary;
      const maxPubSalary = salary;

      const generalInfo = {
        title: titleLink?.text().trim(),
        link: titleLink?.attr('href') ?? '',
        companyName: companyEl?.find('.strong-600')?.text().trim(),
        shortDescription: descriptionEl.text() || 'No short description found',
        description: descriptionEl?.html() || 'No full description found',
        postDate: postDateEl?.attr('datetime') || '',
        pubSalary: {
          min: minPubSalary,
          max: maxPubSalary,
        },
      }

      const analitics = {
        reviews: '0',
        applies: '0',
        isApplied: false,
      }

      const additionalInfo = {
        location: locationEl.length > 1 ? locationEl.eq(0)?.text().trim() : locationEl?.text().trim(),
        typeOfJob: 'Not found',
        experience: 'Not found',
        english: 'Not found',
      }

      const item: jobItem = {
        generalInfo,
        analitics,
        additionalInfo,
        score: 0
      }

      const score = calculateScore(item, scores);
      item.score = score;

      jobsDataArray.push(item);
    });

    return json({ jobsDataArray, totalAmount });

  } catch (err) {
    console.log(err);
    await page.screenshot({ path: './static/error.png', fullPage: true });
    // console.log('Screenshot saved', './static/error.png', `for page ${body.search}`);
    return error(500, 'Internal server error');
  } finally {
    await browser.close();
  }
}


function calculateScore(job: jobItem, scores: userScore[]) {
  let score = 0;

  if (scores.length === 0) {
    return score;
  }

  scores.forEach((scoreItem) => {
    if (job.generalInfo.title.toLowerCase().includes(scoreItem.searchValue.toLowerCase())) {
      score += scoreItem.score;
    }
  });

  return score;
}
