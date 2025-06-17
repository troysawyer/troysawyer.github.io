const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async () => {
  const token  = process.env.FACEBOOK_PAGE_TOKEN;   // page token works for IG too
  const igId   = 'YOUR_IG_BUSINESS_ID';

  const url = `https://graph.facebook.com/v19.0/${igId}/media` +
              `?fields=id,media_url,caption,permalink,timestamp,media_type` +
              `&access_token=${token}&limit=6`;

  const r = await fetch(url);
  const { data } = await r.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type':'application/json', 'Cache-Control':'public,max-age=600' },
    body: JSON.stringify(data)
  };
};
