const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async () => {
  const token  = process.env.FACEBOOK_PAGE_TOKEN;   // page token works for IG too
  const igId   = process.env.INSTAGRAM_BUSINESS_ID;

  if (!token || !igId) {
    const missing = [];
    if (!token) missing.push('FACEBOOK_PAGE_TOKEN');
    if (!igId) missing.push('INSTAGRAM_BUSINESS_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Missing env vars: ${missing.join(', ')}` })
    };
  }

  const url = `https://graph.facebook.com/v19.0/${igId}/media` +
              `?fields=id,media_url,caption,permalink,timestamp,media_type` +
              `&access_token=${token}&limit=6`;

  const r = await fetch(url);
  if (!r.ok) {
    const body = await r.text();
    console.error('Instagram API error', r.status, body);
    return {
      statusCode: r.status,
      body
    };
  }

  const { data } = await r.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type':'application/json', 'Cache-Control':'public,max-age=600' },
    body: JSON.stringify(data)
  };
};
