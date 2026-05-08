import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const MAX_HTML_BYTES = 1_000_000;
const REQUEST_TIMEOUT_MS = 8000;

function json(res, status, body) {
  res.status(status).json(body);
}

function isPrivateIp(ip) {
  if (!ip) return true;

  if (ip === '127.0.0.1' || ip === '0.0.0.0' || ip === '::1') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (/^169\.254\./.test(ip)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)) return true;
  if (/^fc|^fd/i.test(ip)) return true;
  if (/^fe80:/i.test(ip)) return true;

  return false;
}

async function assertSafeUrl(rawUrl) {
  const url = new URL(rawUrl);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http and https URLs are supported.');
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw new Error('Localhost URLs are not allowed.');
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error('Private network URLs are not allowed.');
  }

  const records = await lookup(hostname, { all: true, verbatim: false });
  if (records.some((record) => isPrivateIp(record.address))) {
    throw new Error('Private network URLs are not allowed.');
  }

  return url;
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function getMetaContent(html, key, attr = 'property') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${escapedKey}["'][^>]*>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return '';
}

function getTitle(html) {
  return (
    getMetaContent(html, 'og:title') ||
    getMetaContent(html, 'twitter:title', 'name') ||
    decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  );
}

function getImage(html, baseUrl) {
  const image =
    getMetaContent(html, 'og:image') ||
    getMetaContent(html, 'og:image:url') ||
    getMetaContent(html, 'twitter:image', 'name');

  if (!image) return '';

  try {
    return new URL(image, baseUrl).toString();
  } catch {
    return '';
  }
}

async function readLimitedHtml(response) {
  const reader = response.body?.getReader?.();
  if (!reader) return response.text();

  const chunks = [];
  let total = 0;

  while (total < MAX_HTML_BYTES) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    chunks.push(value);
  }

  return new TextDecoder().decode(Buffer.concat(chunks));
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return json(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const rawUrl = req.method === 'GET' ? req.query?.url : req.body?.url;
    if (!rawUrl) return json(res, 400, { error: 'URL is required.' });

    const targetUrl = await assertSafeUrl(rawUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(targetUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return json(res, 502, { error: 'Could not fetch the link.' });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return json(res, 415, { error: 'The link does not point to an HTML page.' });
    }

    const html = await readLimitedHtml(response);
    return json(res, 200, {
      url: targetUrl.toString(),
      title: getTitle(html),
      image: getImage(html, targetUrl.toString()),
    });
  } catch (error) {
    const message = error.name === 'AbortError' ? 'Preview request timed out.' : error.message;
    return json(res, 400, { error: message || 'Failed to fetch link preview.' });
  }
}
