import { error, json, type RequestEvent } from "@sveltejs/kit";
import Parser from "rss-parser";

export async function POST({ request }: RequestEvent) {
  const body = await request.json();
  const parser = new Parser();

  if (!body.url) {
    return error(400, 'Bad request');
  }

  try {
    const feed = await parser.parseURL(body.url);

    return json({
      feed
    });
  } catch (err) {
    console.log(err);
    return error(500, 'Internal server error' + err);
  }
}
