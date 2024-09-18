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
    await page.goto(`https://robota.ua/`, {
      waitUntil: 'networkidle2',
    });

    await page.screenshot({ path: './static/rabota/initialScreen.png', fullPage: true });

    await page.type('santa-input > div > input', body.search, { delay: 100 });

    await page.screenshot({ path: './static/rabota/searchFilled.png', fullPage: true });

    await page.keyboard.press('Enter');

    await page.waitForSelector('alliance-blured-vacancy');


    const elem = await page.$('alliance-blured-vacancy');
    const boundingBox = await elem?.boundingBox();

    if (boundingBox) {
      await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );
      await page.mouse.wheel({ deltaY: -100 });
    }


    await page.screenshot({ path: './static/rabota/searchResult.png', fullPage: true });


    const feedPage = await page.content();

    const $ = cheerio.load(feedPage);


    const totalAmount = $('div.santa-flex.santa-items-end.santa-justify-between.santa-space-x-20 div.santa-typo-h2.santa-mr-10')?.html()?.trim().split(' ')[0];
    const jobsElements = $('alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a').toArray();
    const jobsDataArray: jobItem[] = [];

    jobsElements.forEach((job) => {
      const countsEl = $(job).find('div:first-child > div:last-child');
      const countsEls = countsEl.find('span');
      const reviewsEl = countsEls.eq(1);
      const appliesEl = countsEls.eq(3);
      const infoEl = $(job).find('div:nth-child(3)');
      const infoEls = infoEl.find('span.text-nowrap');
      const appliedEl = infoEl.find('a.text-success');
      const experienceEl = infoEls.eq(infoEls.length - 2);
      const englishEl = infoEl.find('span.text-nowrap:last-child');
      const pubSalaryEl = $(job).find('.public-salary-item');

      const salaryText = pubSalaryEl?.text()?.trim();
      const salaryMatch = salaryText?.match(/\d+/);
      const salary = salaryMatch ? salaryMatch[0] : '0';
      const minPubSalary = salary;
      const maxPubSalary = salary;

      const mainBlock = $(job).find('a > div');
      const content = mainBlock.eq(1);
      const footer = mainBlock.eq(2);

      const contentEls = content.find('div');
      const desckEl = contentEls.eq(0);
      const companyEl = contentEls.eq(1);

      const generalInfo = {
        title: $(job).find('h2')?.text().trim(),
        link: $(job).attr('href') ?? '',
        companyName: companyEl?.find('span')?.eq(0).text().trim() ?? 'No company name found',
        shortDescription: desckEl.find('span')?.text() || 'No short description found',
        description: desckEl.find('span')?.text() || 'No full description found',
        postDate: footer.find('div')?.eq(1)?.text().trim() || 'No post date found',
        pubSalary: {
          min: minPubSalary,
          max: maxPubSalary,
        },
      }

      const reviewsReg = $(reviewsEl).text()?.trim()?.match(/\d*/);
      const appliesReg = $(appliesEl).text()?.trim()?.match(/\d*/);
      const exp = $(experienceEl).text()?.trim()?.match(/\d/);

      const analitics = {
        reviews: reviewsReg ? reviewsReg[0] : 'no regex found',
        applies: appliesReg ? appliesReg[0] : 'no regex found',
        isApplied: appliedEl.length > 0,
      }

      const additionalInfo = {
        location: companyEl?.find('span')?.eq(1).text().trim() ?? 'No location found',
        typeOfJob: $(job).find('alliance-vac-list-status-label > div')?.text().trim(),
        experience: exp ? exp[0] : 'Not found',
        english: $(englishEl).text(),
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
