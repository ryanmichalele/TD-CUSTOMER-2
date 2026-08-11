const TURNSTILE_SECRET = '0x4AAAAAAEAD1EWY33A5LPdK16jjji8AiA8';

export const handler = async (event) => {
  try {
    const body = event.body || '';
    const params = new URLSearchParams(body);
    const token = params.get('cf-turnstile-response');

    if (!token) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: '<h1>400 Bad Request</h1><p>Missing security check. Please go back and complete the security verification.</p>'
      };
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token
      })
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/html' },
        body: '<h1>403 Forbidden</h1><p>Security verification failed. Please go back and try again.</p>'
      };
    }

    return {
      statusCode: 303,
      headers: { Location: '/dashboard/', 'Cache-Control': 'no-store' },
      body: ''
    };
  } catch (err) {
    console.error('Submit error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: '<h1>500 Internal Server Error</h1><p>Something went wrong. Please try again later.</p>'
    };
  }
};
