const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async () => {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  const pageId = '61576260974976';

  const url = `https://graph.facebook.com/v19.0/${pageId}/posts` +
              `?fields=message,full_picture,permalink_url,created_time` +
              `&limit=5&access_token=${token}`;

  const res = await fetch(url);
  const json = await res.json();

  // squash to what the front-end needs
  const posts = json.data?.map(p => ({
    id: p.id,
    message: p.message,
    image:  p.full_picture,
    url:    p.permalink_url,
    time:   p.created_time
  })) || [];

  // 10-minute edge cache
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600'
    },
    body: JSON.stringify(posts)
  };
};
