/**
 * Cloudflare Pages Function: Reverse Proxy & CORS Gateway for ETLab API
 * 
 * Routes handled:
 * 1. OPTIONS * -> 204 with full CORS headers
 * 2. /api/image-proxy?url=... or /api/file-proxy?url=... -> Media & file proxy
 * 3. /api/* -> Proxied to https://api.students.etlab.app/api/* with official origin headers
 */

const ETLAB_ORIGIN = 'https://api.students.etlab.app';
const OFFICIAL_WEB_ORIGIN = 'https://students.etlab.app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization, X-Secret, X-Request-ID, X-Institute-ID, X-Etlab-App, Cache-Control, Pragma, If-None-Match',
  'Access-Control-Expose-Headers': 'ETag, Content-Disposition, X-Session-Token',
  'Access-Control-Max-Age': '86400',
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 1. Handle CORS Preflight Requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  // 2. Media & File Proxy Route: /api/image-proxy?url=... or /api/file-proxy?url=...
  if (url.pathname === '/api/image-proxy' || url.pathname === '/api/file-proxy' || url.pathname === '/api/proxy') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    try {
      const parsed = new URL(targetUrl);
      if (!parsed.hostname.endsWith('etlab.app') && !parsed.hostname.includes('unsplash.com')) {
        return new Response(JSON.stringify({ error: 'Disallowed host for proxy' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      const imgHeaders = new Headers();
      imgHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      imgHeaders.set('Referer', `${OFFICIAL_WEB_ORIGIN}/`);
      imgHeaders.set('Origin', OFFICIAL_WEB_ORIGIN);

      const token = url.searchParams.get('token') || request.headers.get('Authorization');
      if (token) {
        imgHeaders.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
      }

      const inst = url.searchParams.get('inst') || request.headers.get('X-Institute-ID');
      if (inst) {
        imgHeaders.set('X-Institute-ID', inst);
      }

      const imgRes = await fetch(targetUrl, {
        method: 'GET',
        headers: imgHeaders
      });

      if (!imgRes.ok) {
        return new Response(imgRes.body, {
          status: imgRes.status,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': imgRes.headers.get('Content-Type') || 'application/json'
          }
        });
      }

      const headers = new Headers(CORS_HEADERS);
      const contentType = imgRes.headers.get('Content-Type') || (targetUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
      headers.set('Content-Type', contentType);
      const disposition = imgRes.headers.get('Content-Disposition');
      if (disposition) {
        headers.set('Content-Disposition', disposition);
      }
      headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');

      return new Response(imgRes.body, {
        status: 200,
        headers
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Proxy Error', details: e?.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }

  // 3. API Proxy Route: Forward /api/* -> https://api.students.etlab.app/api/*
  const targetPath = url.pathname + url.search;
  const targetUrl = `${ETLAB_ORIGIN}${targetPath}`;

  const forwardHeaders = new Headers();
  const allowedHeaders = [
    'authorization',
    'x-institute-id',
    'x-request-id',
    'x-secret',
    'x-etlab-app',
    'content-type',
    'accept',
    'if-none-match',
    'cache-control'
  ];

  for (const name of allowedHeaders) {
    const val = request.headers.get(name);
    if (val) forwardHeaders.set(name, val);
  }

  forwardHeaders.set('Origin', OFFICIAL_WEB_ORIGIN);
  forwardHeaders.set('Referer', `${OFFICIAL_WEB_ORIGIN}/`);
  forwardHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    const isBodyAllowed = request.method !== 'GET' && request.method !== 'HEAD';
    const body = isBodyAllowed ? await request.text() : undefined;

    const upstreamRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body
    });

    const responseHeaders = new Headers();

    const skipHeaders = new Set([
      'content-encoding',
      'content-length',
      'transfer-encoding',
      'connection',
      'access-control-allow-origin',
      'access-control-allow-credentials',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'content-security-policy',
      'cross-origin-resource-policy',
      'cross-origin-opener-policy'
    ]);

    upstreamRes.headers.forEach((val, key) => {
      if (!skipHeaders.has(key.toLowerCase())) {
        responseHeaders.set(key, val);
      }
    });

    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(k, v);
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'ETBridge Gateway Proxy Error',
      message: err?.message || 'Failed to communicate with ETLab upstream servers',
      target: targetUrl
    }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }
}
