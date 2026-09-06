import { projects as localProjects } from '../data/projects';
import { certificates as localCertificates } from '../data/certificates';
import { honors as localHonors } from '../data/honors';

export const projectCategoryFallbacks = [
  { id: 'data', slug: 'data', name_en: 'Data Analysis', name_id: 'Analisis Data', icon_name: 'database', sort_order: 1 },
  { id: 'lomba', slug: 'lomba', name_en: 'Competitions & Business Case', name_id: 'Lomba & Studi Kasus Bisnis', icon_name: 'trophy', sort_order: 2 },
  { id: 'tugas', slug: 'tugas', name_en: 'Coursework & Academic Reports', name_id: 'Tugas Kuliah & Laporan Akademis', icon_name: 'graduation-cap', sort_order: 3 },
  { id: 'web', slug: 'web', name_en: 'Web Development', name_id: 'Pengembangan Web', icon_name: 'globe', sort_order: 4 },
  { id: 'desain', slug: 'desain', name_en: 'Digital Art & Design', name_id: 'Seni Digital & Desain', icon_name: 'palette', sort_order: 5 },
  { id: 'web3', slug: 'web3', name_en: 'Web3 & Crypto Research', name_id: 'Riset Web3 & Crypto', icon_name: 'blocks', sort_order: 6 },
];

export const certificateCategoryFallbacks = [
  { id: 'ai', slug: 'ai', name_en: 'AI & Machine Learning', name_id: 'AI & Machine Learning', icon_name: 'brain', sort_order: 1 },
  { id: 'data', slug: 'data', name_en: 'Data Science & Analytics', name_id: 'Data Science & Analytics', icon_name: 'database', sort_order: 2 },
  { id: 'database', slug: 'database', name_en: 'Database & SQL', name_id: 'Database & SQL', icon_name: 'table', sort_order: 3 },
  { id: 'web3', slug: 'web3', name_en: 'Web3 & Crypto', name_id: 'Web3 & Crypto', icon_name: 'blocks', sort_order: 4 },
  { id: 'programming', slug: 'programming', name_en: 'Programming', name_id: 'Pemrograman', icon_name: 'code', sort_order: 5 },
  { id: 'design', slug: 'design', name_en: 'Design & UI/UX', name_id: 'Desain & UI/UX', icon_name: 'palette', sort_order: 6 },
  { id: 'language', slug: 'language', name_en: 'Language', name_id: 'Bahasa', icon_name: 'languages', sort_order: 7 },
  { id: 'seminar', slug: 'seminar', name_en: 'Seminar & Event', name_id: 'Seminar & Event', icon_name: 'presentation', sort_order: 8 },
];

export const honorCategoryFallbacks = [
  { id: 'speaking', slug: 'speaking', name_en: 'Speaking & Teaching', name_id: 'Pemateri & Edukasi', icon_name: 'mic', sort_order: 1 },
  { id: 'competition', slug: 'competition', name_en: 'Competition Awards', name_id: 'Penghargaan Lomba', icon_name: 'medal', sort_order: 2 },
];

const certificateCategoryById = {
  'cert-18': 'ai',
  'cert-17': 'ai',
  'cert-16': 'seminar',
  'cert-15': 'data',
  'cert-14': 'ai',
  'cert-13': 'database',
  'cert-12': 'database',
  'cert-11': 'data',
  'cert-10': 'database',
  'cert-9': 'data',
  'cert-8': 'web3',
  'cert-7': 'web3',
  'cert-6': 'database',
  'cert-5': 'data',
  'cert-4': 'web3',
  'cert-3': 'programming',
  'cert-2': 'design',
  'cert-1': 'language',
};

const honorCategoryById = {
  'honor-1': 'speaking',
  'honor-2': 'competition',
};

export const projectItemFallbacks = localProjects.map((project, index) => ({
  id: project.id,
  source_key: `static:${project.id}`,
  id_string: project.id,
  category: project.category,
  category_id: project.category,
  title_en: project.title.en,
  title_id: project.title.id,
  file: project.file,
  preview: project.preview,
  type: project.type === 'external' || project.type === 'iframe' ? 'link' : project.type,
  is_featured: ['ai-1', 'ai-2', 'ai-3'].includes(project.id),
  featured_order: project.id === 'ai-1' ? 1 : project.id === 'ai-2' ? 2 : project.id === 'ai-3' ? 3 : null,
  sort_order: index + 1,
}));

export const certificateItemFallbacks = localCertificates.map((certificate, index) => ({
  id: certificate.id,
  source_key: `static:${certificate.id}`,
  category_id: certificateCategoryById[certificate.id] || 'data',
  title: certificate.title,
  file_path: certificate.file,
  preview_path: certificate.preview,
  type: certificate.type,
  sort_order: index + 1,
}));

export const honorItemFallbacks = localHonors.map((honor, index) => ({
  id: honor.id,
  source_key: `static:${honor.id}`,
  category_id: honorCategoryById[honor.id] || 'competition',
  title_en: honor.title.en,
  title_id: honor.title.id,
  image_path: honor.image,
  file_path: honor.image,
  preview_path: honor.image,
  type: honor.type,
  sort_order: index + 1,
}));

export function isSamePortfolioItem(item, fallbackItem, contentType) {
  return matchesFallback(item, fallbackItem, contentType);
}

export function mergePortfolioCategories(dbCategories = [], fallbackCategories = []) {
  const merged = [...(dbCategories || [])];

  (fallbackCategories || []).forEach((fallbackCategory) => {
    const exists = merged.some((category) => (
      category.id === fallbackCategory.id ||
      category.slug === fallbackCategory.slug
    ));

    if (!exists) merged.push(fallbackCategory);
  });

  return merged.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

export function mergePortfolioItems(dbItems = [], fallbackItems = [], categories = [], contentType) {
  const merged = [...(dbItems || [])];

  (fallbackItems || []).forEach((fallbackItem) => {
    const exists = merged.some((item) => matchesFallback(item, fallbackItem, contentType));
    if (!exists) merged.push(fallbackItem);
  });

  return hydratePortfolioCategories(merged, fallbackItems, categories, contentType)
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

function getFallbackCategoryId(fallbackItem, categories) {
  const fallbackCategory = fallbackItem.category_id || fallbackItem.category;
  const matchedCategory = categories.find((category) => (
    category.id === fallbackCategory ||
    category.slug === fallbackCategory ||
    category.slug === fallbackItem.category
  ));

  return matchedCategory?.id || fallbackCategory || null;
}

function matchesFallback(item, fallbackItem, contentType) {
  if (item.source_key && item.source_key === fallbackItem.source_key) return true;

  if (contentType === 'projects') {
    return (
      (item.id_string && item.id_string === fallbackItem.id_string) ||
      (item.file && item.file === fallbackItem.file) ||
      (item.title_en && item.title_en === fallbackItem.title_en)
    );
  }

  if (contentType === 'certificates') {
    return (
      (item.file_path && item.file_path === fallbackItem.file_path) ||
      (item.title && item.title === fallbackItem.title)
    );
  }

  return (
    (item.file_path && item.file_path === fallbackItem.file_path) ||
    (item.image_path && item.image_path === fallbackItem.image_path) ||
    (item.title_en && item.title_en === fallbackItem.title_en)
  );
}

export function hydratePortfolioCategories(items, fallbackItems, categories, contentType) {
  return (items || []).map((item) => {
    const existingCategory = categories.find((category) => (
      category.id === item.category_id ||
      category.slug === item.category_id ||
      category.slug === item.category
    ));

    if (existingCategory) {
      return { ...item, category_id: existingCategory.id };
    }

    if (contentType === 'projects' && item.category) {
      const category = categories.find((candidate) => candidate.slug === item.category);
      if (category) return { ...item, category_id: category.id };
    }

    const fallbackItem = fallbackItems.find((candidate) => matchesFallback(item, candidate, contentType));
    if (!fallbackItem) return item;

    return {
      ...item,
      category_id: getFallbackCategoryId(fallbackItem, categories),
      sort_order: item.sort_order ?? fallbackItem.sort_order,
    };
  });
}
