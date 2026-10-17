import { projects as localProjects } from '../data/projects.js';
import { certificates as localCertificates } from '../data/certificates.js';
import { honors as localHonors } from '../data/honors.js';

export const projectCategoryFallbacks = [
  { id: 'data', slug: 'data', name_en: 'AI & Data Systems', name_id: 'Sistem AI & Data', icon_name: 'brain', sort_order: 1 },
  { id: 'web3', slug: 'web3', name_en: 'Web3 & Autonomous Agents', name_id: 'Web3 & Agen Mandiri', icon_name: 'blocks', sort_order: 2 },
  { id: 'lomba', slug: 'lomba', name_en: 'Competitions & Business Case', name_id: 'Lomba & Studi Kasus Bisnis', icon_name: 'trophy', sort_order: 3 },
  { id: 'tugas', slug: 'tugas', name_en: 'Coursework & Academic Reports', name_id: 'Tugas Kuliah & Laporan Akademis', icon_name: 'graduation-cap', sort_order: 4 },
  { id: 'web', slug: 'web', name_en: 'Web Development', name_id: 'Pengembangan Web', icon_name: 'globe', sort_order: 5 },
  { id: 'desain', slug: 'desain', name_en: 'Digital Art & Design', name_id: 'Seni Digital & Desain', icon_name: 'palette', sort_order: 6 },
];

export const certificateCategoryFallbacks = [
  { id: 'ai', slug: 'ai', name_en: 'Artificial Intelligence', name_id: 'Kecerdasan Buatan', icon_name: 'cpu', sort_order: 1 },
  { id: 'data', slug: 'data', name_en: 'Data Science & SQL', name_id: 'Sains Data & SQL', icon_name: 'database', sort_order: 2 },
  { id: 'web3', slug: 'web3', name_en: 'Web3 & Crypto', name_id: 'Web3 & Crypto', icon_name: 'blocks', sort_order: 3 },
  { id: 'seminar', slug: 'seminar', name_en: 'National Seminar & Research', name_id: 'Seminar Nasional & Riset', icon_name: 'book-open', sort_order: 4 },
  { id: 'general', slug: 'general', name_en: 'Design & Professional', name_id: 'Desain & Profesional', icon_name: 'layout', sort_order: 5 },
];

export const honorCategoryFallbacks = [
  { id: 'speaking', slug: 'speaking', name_en: 'Speaking & Teaching', name_id: 'Pemateri & Edukasi', icon_name: 'mic', sort_order: 1 },
  { id: 'competition', slug: 'competition', name_en: 'Competition Awards', name_id: 'Penghargaan Lomba', icon_name: 'medal', sort_order: 2 },
  { id: 'scholarship', slug: 'scholarship', name_en: 'Scholarships & Grants', name_id: 'Beasiswa & Hibah', icon_name: 'award', sort_order: 3 },
];

const certificateCategoryById = {
  'cert-20': 'ai',
  'cert-19': 'web3',
  'cert-18': 'ai',
  'cert-17': 'ai',
  'cert-16': 'seminar',
  'cert-15': 'data',
  'cert-14': 'ai',
  'cert-13': 'data',
  'cert-12': 'data',
  'cert-11': 'data',
  'cert-10': 'data',
  'cert-9': 'data',
  'cert-8': 'web3',
  'cert-7': 'web3',
  'cert-6': 'data',
  'cert-5': 'data',
  'cert-4': 'web3',
  'cert-3': 'data',
  'cert-2': 'general',
  'cert-1': 'general',
};

const honorCategoryById = {
  'honor-1': 'speaking',
  'honor-2': 'competition',
  'honor-3': 'competition',
  'honor-4': 'scholarship',
};

export const projectItemFallbacks = localProjects.map((project, index) => ({
  id: project.id,
  id_string: project.id,
  source_key: `static:${project.id}`,
  category_id: project.category,
  title_en: project.title_en,
  title_id: project.title_id,
  description_en: project.description_en || null,
  description_id: project.description_id || null,
  file: project.file,
  preview: project.preview,
  type: project.type === 'external' || project.type === 'iframe' ? 'link' : project.type,
  is_featured: ['ai-0', 'ai-1', 'ai-2'].includes(project.id),
  featured_order: project.id === 'ai-0' ? 1 : project.id === 'ai-1' ? 2 : project.id === 'ai-2' ? 3 : null,
  sort_order: index + 1,
}));

export const certificateItemFallbacks = localCertificates.map((cert, index) => ({
  id: cert.id,
  id_string: cert.id,
  source_key: `static:${cert.id}`,
  category_id: certificateCategoryById[cert.id] || 'general',
  title: cert.title,
  file_path: cert.file,
  preview_path: cert.preview,
  type: cert.type,
  sort_order: index + 1,
}));

export const honorItemFallbacks = localHonors.map((honor, index) => ({
  id: honor.id,
  id_string: honor.id,
  source_key: `static:${honor.id}`,
  category_id: honorCategoryById[honor.id] || 'competition',
  title_en: honor.title.en,
  title_id: honor.title.id,
  image_path: honor.image,
  type: honor.type,
  sort_order: index + 1,
}));

export const KNOWN_DELETED_STATIC_IDS = [
  'tugas-1',
  'tugas-2',
  'tugas-3',
  'tugas-4',
  'lomba-1',
  'static:tugas-1',
  'static:tugas-2',
  'static:tugas-3',
  'static:tugas-4',
  'static:lomba-1',
  'static:honor-3',
  'static:honor-4',
];

export function mergePortfolioCategories(dbCategories = [], fallbackCategories = []) {
  const deletedStaticIds = getDeletedStaticIds();

  // If database categories exist, the database is the authoritative source
  if (Array.isArray(dbCategories) && dbCategories.length > 0) {
    return [...dbCategories]
      .filter((c) => !deletedStaticIds.includes(c.id) && !deletedStaticIds.includes(c.slug))
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  }

  return (fallbackCategories || [])
    .filter((c) => !deletedStaticIds.includes(c.id) && !deletedStaticIds.includes(c.slug))
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

export function getDeletedStaticIds() {
  const ids = new Set(KNOWN_DELETED_STATIC_IDS);
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('portfolio_deleted_static_ids') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => ids.add(id));
      }
    }
  } catch {
    // ignore
  }
  return Array.from(ids);
}

export function markStaticIdDeleted(id) {
  try {
    if (typeof window === 'undefined') return;
    const current = getDeletedStaticIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem('portfolio_deleted_static_ids', JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Failed to save deleted static ID:', err);
  }
}

function matchesFallback(item, fallbackItem, contentType) {
  if (!item || !fallbackItem) return false;
  if (item.source_key && fallbackItem.source_key && item.source_key === fallbackItem.source_key) return true;
  if (item.id === fallbackItem.id) return true;
  if (item.id_string && fallbackItem.id_string && item.id_string === fallbackItem.id_string) return true;

  const isProject = contentType === 'project' || contentType === 'projects';
  const isCertificate = contentType === 'certificate' || contentType === 'certificates';
  const isHonor = contentType === 'honor' || contentType === 'honors';

  if (isProject) {
    return Boolean(
      (item.title_en && item.title_en === fallbackItem.title_en) ||
      (item.title_id && item.title_id === fallbackItem.title_id) ||
      (item.file && fallbackItem.file && item.file === fallbackItem.file)
    );
  }

  if (isCertificate) {
    return Boolean(
      (item.title && item.title === fallbackItem.title) ||
      (item.file_path && fallbackItem.file_path && item.file_path === fallbackItem.file_path)
    );
  }

  if (isHonor) {
    return Boolean(
      (item.title_en && item.title_en === fallbackItem.title_en) ||
      (item.title_id && item.title_id === fallbackItem.title_id) ||
      (item.image_path && fallbackItem.image_path && item.image_path === fallbackItem.image_path)
    );
  }

  return false;
}

export function mergePortfolioItems(dbItems = [], fallbackItems = [], categories = [], contentType) {
  const deletedStaticIds = getDeletedStaticIds();

  // If the database has items, the database is the authoritative source of truth.
  // We do NOT resurrect deleted fallback items when the database is active.
  if (Array.isArray(dbItems) && dbItems.length > 0) {
    return [...dbItems]
      .filter((item) => {
        if (deletedStaticIds.includes(item.id)) return false;
        if (item.source_key && deletedStaticIds.includes(item.source_key)) return false;
        if (item.id_string && deletedStaticIds.includes(item.id_string)) return false;
        return true;
      })
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  }

  // Fallback mode: used when the database is empty (e.g. honors) or offline
  return (fallbackItems || [])
    .filter((fallbackItem) => {
      if (deletedStaticIds.includes(fallbackItem.id)) return false;
      if (fallbackItem.source_key && deletedStaticIds.includes(fallbackItem.source_key)) return false;
      if (fallbackItem.id_string && deletedStaticIds.includes(fallbackItem.id_string)) return false;
      return true;
    })
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

export function resolveFeaturedProjects(allProjects = []) {
  const pool = Array.isArray(allProjects) && allProjects.length > 0 ? allProjects : projectItemFallbacks;

  // 1. Explicitly featured projects from database / portfolio
  const explicitlyFeatured = pool
    .filter((project) => Boolean(project.is_featured))
    .sort((a, b) => (Number(a.featured_order) || 999) - (Number(b.featured_order) || 999));

  // If user has 3 or more explicitly featured projects, take top 3
  if (explicitlyFeatured.length >= 3) {
    return explicitlyFeatured.slice(0, 3);
  }

  // 2. Guaranteed fallback: if fewer than 3 are explicitly marked, backfill from flagship fallbacks
  const usedIds = new Set();
  explicitlyFeatured.forEach((p) => {
    if (p.id) usedIds.add(String(p.id));
    if (p.source_key) usedIds.add(String(p.source_key));
    if (p.id_string) usedIds.add(String(p.id_string));
  });

  const deletedStaticIds = getDeletedStaticIds();
  const fallbackCards = projectItemFallbacks.filter((fallback) => {
    if (deletedStaticIds.includes(fallback.id) || (fallback.source_key && deletedStaticIds.includes(fallback.source_key))) {
      return false;
    }
    const id = String(fallback.id);
    const sourceKey = String(fallback.source_key);
    const idStr = String(fallback.id_string);
    return !usedIds.has(id) && !usedIds.has(sourceKey) && !usedIds.has(idStr);
  });

  return [...explicitlyFeatured, ...fallbackCards].slice(0, 3);
}

