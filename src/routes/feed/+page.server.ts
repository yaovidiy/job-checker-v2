import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ url }: ServerLoadEvent) {
  const link = url.searchParams.get('link');
  const djinni = 'https://djinni.co/jobs/?';
  return {
    feedUrl: `${djinni}${link}`
  }
}