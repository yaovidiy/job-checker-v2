import { db } from '$lib/server/db/db.js'

export async function load(event) {
  if (!event.locals.user) {
    return {
      username: null,
      userPreferences: null
    }
  }

  const userPreferences = await db.userPreferences.findFirst({
    where: {
      userId: event.locals.user.id
    }
  });

  const userScores = await db.userScore.count({
    where: {
      userId: event.locals.user.id
    }
  });


  return {
    username: event.locals.user?.username,
    userPreferences,
    hasScores: userScores > 0
  }
}