import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ url }: ServerLoadEvent) {
  const page = url.searchParams.get('page');

  return {
    feedUrl: page
  }
}