import { projects as localProjects } from '../data/projects';
import { certificates as localCertificates } from '../data/certificates';
import { honors as localHonors } from '../data/honors';

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
  is_featured: ['ai-0', 'ai-1', 'ai-amd'].includes(project.id),
  featured_order: project.id === 'ai-0' ? 1 : project.id === 'ai-1' ? 2 : project.id === 'ai-amd' ? 3 : null,
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

export function mergePortfolioCategories(dbCategories = [], fallbackCategories = []) {
  const merged = [...(dbCategories || [])];

  (fallbackCategories || []).forEach((fallback) => {
    const exists = merged.some((item) => item.id === fallback.id || item.slug === fallback.slug);
    if (!exists) merged.push(fallback);
  });

  return merged.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

function matchesFallback(item, fallbackItem, contentType) {
  if (!item || !fallbackItem) return false;
  if (item.source_key && fallbackItem.source_key && item.source_key === fallbackItem.source_key) return true;
  if (item.id === fallbackItem.id) return true;
  if (item.id_string && fallbackItem.id_string && item.id_string === fallbackItem.id_string) return true;

  if (contentType === 'project') {
    return Boolean(
      (item.title_en && item.title_en === fallbackItem.title_en) ||
      (item.title_id && item.title_id === fallbackItem.title_id) ||
      (item.file && fallbackItem.file && item.file === fallbackItem.file)
    );
  }

  if (contentType === 'certificate') {
    return Boolean(
      (item.title && item.title === fallbackItem.title) ||
      (item.file_path && fallbackItem.file_path && item.file_path === fallbackItem.file_path)
    );
  }

  if (contentType === 'honor') {
    return Boolean(
      (item.title_en && item.title_en === fallbackItem.title_en) ||
      (item.title_id && item.title_id === fallbackItem.title_id) ||
      (item.image_path && fallbackItem.image_path && item.image_path === fallbackItem.image_path)
    );
  }

  return false;
}

export function mergePortfolioItems(dbItems = [], fallbackItems = [], categories = [], contentType) {
  const merged = [...(dbItems || [])];

  (fallbackItems || []).forEach((fallbackItem) => {
    const exists = merged.some((item) => matchesFallback(item, fallbackItem, contentType));
    if (!exists) merged.push(fallbackItem);
  });

  return merged.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}
