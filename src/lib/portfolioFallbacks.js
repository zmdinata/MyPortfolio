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
  { id: 'cert-general', slug: 'general', name_en: 'Certifications', name_id: 'Sertifikasi', icon_name: 'badge-check', sort_order: 1 },
];

export const honorCategoryFallbacks = [
  { id: 'honor-general', slug: 'general', name_en: 'Honors & Awards', name_id: 'Penghargaan & Prestasi', icon_name: 'award', sort_order: 1 },
];

export const projectItemFallbacks = localProjects.map((project, index) => ({
  id: project.id,
  id_string: project.id,
  category: project.category,
  category_id: project.category,
  title_en: project.title.en,
  title_id: project.title.id,
  file: project.file,
  preview: project.preview,
  type: project.type === 'external' || project.type === 'iframe' ? 'link' : project.type,
  is_featured: ['data-1', 'data-2', 'web-1'].includes(project.id),
  featured_order: project.id === 'data-1' ? 1 : project.id === 'data-2' ? 2 : project.id === 'web-1' ? 3 : null,
  sort_order: index + 1,
}));

export const certificateItemFallbacks = localCertificates.map((certificate, index) => ({
  id: certificate.id,
  category_id: 'cert-general',
  title: certificate.title,
  file_path: certificate.file,
  preview_path: certificate.preview,
  type: certificate.type,
  sort_order: index + 1,
}));

export const honorItemFallbacks = localHonors.map((honor, index) => ({
  id: honor.id,
  category_id: 'honor-general',
  title_en: honor.title.en,
  title_id: honor.title.id,
  image_path: honor.image,
  file_path: honor.image,
  preview_path: honor.image,
  type: honor.type,
  sort_order: index + 1,
}));
