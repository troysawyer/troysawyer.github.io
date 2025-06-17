const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async () => {
  const bearer = process.env.TWITTER_BEARER_TOKEN;
  const username = 'theflyingappsk';

  // 1. Resolve user id
  const u = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}`, {
      headers: { Authorization: `Bearer ${bearer}` }
    });
  const { data: user } = await u.json();

  // 2. Latest tweets
  const t = await fetch(
    `https://api.twitter.com/2/users/${user.id}/tweets?exclude=retweets,replies&max_results=5`, {
      headers: { Authorization: `Bearer ${bearer}` }
    });
  const { data: tweets } = await t.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public,max-age=600' },
    body: JSON.stringify(tweets.map(x => ({
      id:x.id,
      text:x.text,
      url:`https://x.com/${username}/status/${x.id}`
    })))
  };
};
