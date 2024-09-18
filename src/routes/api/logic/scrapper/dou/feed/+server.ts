import { json, error, type RequestEvent } from '@sveltejs/kit';
import puppeteer, { Page, type CookieParam } from 'puppeteer';
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
      SESSION_COOKIES_VALUE = preferenses.douSessionCookie;
    }

    // const pagination = body.page ?? 1;
    const cookie_sessionid: CookieParam = {
      name: 'sessionid',
      value: SESSION_COOKIES_VALUE,
      domain: '.dou.ua',
      path: '/',
      expires: -1,
      priority: 'Medium',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    }

    await page.setCookie(cookie_sessionid);
    await page.goto(`https://jobs.dou.ua/vacancies/`, {
      waitUntil: 'networkidle2',
    });

    await page.screenshot({ path: './static/dou/initialState.png', fullPage: true });

    await page.type('input[name="search"].job', body.search, { delay: 100 });

    await page.screenshot({ path: './static/dou/InputSearchValue.png', fullPage: true });

    await page.keyboard.press('Enter');

    await page.waitForSelector('#vacancyListId ul.lt > li');

    await page.screenshot({ path: './static/dou/SearchResults.png', fullPage: true });

    // await loadAllResults(page);

    const feedPage = await page.content();

    const $ = cheerio.load(feedPage);


    const totalAmount = $('.b-vacancies-head .b-inner-page-header h1')?.text()?.split(' ')[0];
    const jobsElements = $('#vacancyListId ul.lt > li').toArray();
    const jobsDataArray: jobItem[] = [];

    jobsElements.forEach((job) => {
      const header = $(job).find('div.title');
      const countsEl = $(job).find('div:first-child > div:last-child');
      const countsEls = countsEl.find('span');
      const postDateEl = $(job).find('.date');
      const reviewsEl = countsEls.eq(1);
      const appliesEl = countsEls.eq(3);
      const infoEl = $(job).find('div:nth-child(3)');
      const infoEls = infoEl.find('span.text-nowrap');
      const locationEl = header.find('.cities');
      const appliedEl = infoEl.find('a.text-success');
      const typeOfJobEl = infoEls.eq(0);
      const experienceEl = infoEls.eq(infoEls.length - 2);
      const englishEl = infoEl.find('span.text-nowrap:last-child');
      const companyEl = header.find('a.company');
      const titleLink = header.find('a.vt');
      const shortDescEl = $(job).find('.sh-info');
      const descEl = $(job).find('.sh-info');
      const pubSalaryEl = $(job).find('.public-salary-item');

      const salaryText = pubSalaryEl?.text()?.trim();
      const salaryMatch = salaryText?.match(/\d+/);
      const salary = salaryMatch ? salaryMatch[0] : '0';
      const minPubSalary = salary;
      const maxPubSalary = salary;

      const generalInfo = {
        title: titleLink?.text().trim(),
        link: titleLink?.attr('href') ?? '',
        companyName: companyEl?.text().trim(),
        shortDescription: shortDescEl.text() || 'No short description found',
        description: descEl?.html() || 'No full description found',
        postDate: postDateEl?.text().trim() || '',
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
        location: $(locationEl).text().trim(),
        typeOfJob: $(typeOfJobEl).text().trim(),
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

async function loadAllResults(page: Page) {
  const loadMoreBtn = await page.$('div.more-btn > a');
  const isVisible = await loadMoreBtn?.isVisible();
  if (isVisible && loadMoreBtn) {
    console.log(loadMoreBtn, 'is visible');
    await loadMoreBtn.click();
    await page.waitForSelector('#vacancyListId > ul.lt');
    await loadAllResults(page);
  }
}
