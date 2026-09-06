// In-memory cache for portfolio data to ensure instant navigation (0ms)
// without triggering redundant Supabase network requests on every tab click.

import { supabase } from './supabase';
import {
  certificateCategoryFallbacks,
  certificateItemFallbacks,
  honorCategoryFallbacks,
  honorItemFallbacks,
  mergePortfolioCategories,
  mergePortfolioItems,
  projectCategoryFallbacks,
  projectItemFallbacks,
} from './portfolioFallbacks';

const memoryCache = {
  projects: null,
  projectCategories: null,
  certificates: null,
  certificateCategories: null,
  honors: null,
  honorCategories: null,
  lastFetched: {
    projects: 0,
    certificates: 0,
    honors: 0,
  },
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedProjects() {
  const now = Date.now();
  if (memoryCache.projects && (now - memoryCache.lastFetched.projects < CACHE_TTL)) {
    return {
      projects: memoryCache.projects,
      categories: memoryCache.projectCategories,
    };
  }

  try {
    const [{ data: categoryData, error: categoryError }, { data: projectData, error: projectError }] =
      await Promise.all([
        supabase.from('project_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      ]);

    const categories = mergePortfolioCategories(
      !categoryError ? categoryData || [] : [],
      projectCategoryFallbacks
    );

    const projects = mergePortfolioItems(
      !projectError ? projectData || [] : [],
      projectItemFallbacks,
      categories,
      'projects'
    );

    memoryCache.projectCategories = categories;
    memoryCache.projects = projects;
    memoryCache.lastFetched.projects = now;

    return { projects, categories };
  } catch (err) {
    console.warn('Failed to fetch projects, using fallbacks:', err);
    return {
      projects: memoryCache.projects || projectItemFallbacks,
      categories: memoryCache.projectCategories || projectCategoryFallbacks,
    };
  }
}

export async function getCachedCertificates() {
  const now = Date.now();
  if (memoryCache.certificates && (now - memoryCache.lastFetched.certificates < CACHE_TTL)) {
    return {
      certificates: memoryCache.certificates,
      categories: memoryCache.certificateCategories,
    };
  }

  try {
    const [{ data: categoryData, error: categoryError }, { data: certificateData, error: certificateError }] =
      await Promise.all([
        supabase.from('certificate_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('certificates').select('*').order('sort_order', { ascending: true }),
      ]);

    const categories = mergePortfolioCategories(
      !categoryError ? categoryData || [] : [],
      certificateCategoryFallbacks
    );

    const certificates = mergePortfolioItems(
      !certificateError ? certificateData || [] : [],
      certificateItemFallbacks,
      categories,
      'certificates'
    );

    memoryCache.certificateCategories = categories;
    memoryCache.certificates = certificates;
    memoryCache.lastFetched.certificates = now;

    return { certificates, categories };
  } catch (err) {
    console.warn('Failed to fetch certificates, using fallbacks:', err);
    return {
      certificates: memoryCache.certificates || certificateItemFallbacks,
      categories: memoryCache.certificateCategories || certificateCategoryFallbacks,
    };
  }
}

export async function getCachedHonors() {
  const now = Date.now();
  if (memoryCache.honors && (now - memoryCache.lastFetched.honors < CACHE_TTL)) {
    return {
      honors: memoryCache.honors,
      categories: memoryCache.honorCategories,
    };
  }

  try {
    const [{ data: categoryData, error: categoryError }, { data: honorData, error: honorError }] =
      await Promise.all([
        supabase.from('honor_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('honors').select('*').order('sort_order', { ascending: true }),
      ]);

    const categories = mergePortfolioCategories(
      !categoryError ? categoryData || [] : [],
      honorCategoryFallbacks
    );

    const honors = mergePortfolioItems(
      !honorError ? honorData || [] : [],
      honorItemFallbacks,
      categories,
      'honors'
    );

    memoryCache.honorCategories = categories;
    memoryCache.honors = honors;
    memoryCache.lastFetched.honors = now;

    return { honors, categories };
  } catch (err) {
    console.warn('Failed to fetch honors, using fallbacks:', err);
    return {
      honors: memoryCache.honors || honorItemFallbacks,
      categories: memoryCache.honorCategories || honorCategoryFallbacks,
    };
  }
}

export function invalidatePortfolioCache() {
  memoryCache.projects = null;
  memoryCache.certificates = null;
  memoryCache.honors = null;
  memoryCache.lastFetched = { projects: 0, certificates: 0, honors: 0 };
}
