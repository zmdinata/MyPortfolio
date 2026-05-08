import { supabase } from './supabase';

export const PORTFOLIO_MEDIA_BUCKET = 'portfolio-media';
export const portfolioItemTypes = ['pdf', 'image', 'link'];

export function normalizeLinkUrl(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  return `https://${value}`;
}

export function isExternalUrl(url) {
  return /^https?:\/\//i.test(String(url || '').trim());
}

export function isLinkType(type) {
  return type === 'link' || type === 'external' || type === 'iframe';
}

export function getDisplayType(type) {
  return isLinkType(type) ? 'link' : type || 'pdf';
}

export function getPreviewForItem(item, fallback = '') {
  return item?.preview || item?.preview_path || item?.image_path || fallback;
}

export function getFileForItem(item) {
  return item?.file || item?.file_path || item?.image_path || '';
}

export function buildStorageFolder(contentType, mediaRole = 'files') {
  return `${contentType}/${mediaRole}`;
}

function sanitizeFileName(fileName) {
  return String(fileName || 'upload')
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export async function uploadPortfolioFile(file, folder) {
  if (!file) return '';

  const safeName = sanitizeFileName(file.name);
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from(PORTFOLIO_MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(PORTFOLIO_MEDIA_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export function getPortfolioStoragePath(publicUrl) {
  const value = String(publicUrl || '');
  const marker = `/storage/v1/object/public/${PORTFOLIO_MEDIA_BUCKET}/`;
  const markerIndex = value.indexOf(marker);

  if (markerIndex === -1) return '';

  return decodeURIComponent(value.slice(markerIndex + marker.length));
}

export async function deletePortfolioFileByUrl(publicUrl) {
  const path = getPortfolioStoragePath(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage
    .from(PORTFOLIO_MEDIA_BUCKET)
    .remove([path]);

  if (error) console.warn('Failed to delete old portfolio media:', error.message);
}

export async function fetchLinkPreview(url) {
  const normalizedUrl = normalizeLinkUrl(url);
  if (!isExternalUrl(normalizedUrl)) {
    throw new Error('Only http/https links can use automatic previews.');
  }

  const response = await fetch('/api/link-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: normalizedUrl }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to fetch link preview.');
  }

  return payload;
}
