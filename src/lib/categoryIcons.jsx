import { DynamicIcon, iconNames } from 'lucide-react/dynamic';

const fallbackIcon = 'folder';

export const commonCategoryIcons = [
  'folder',
  'database',
  'trophy',
  'graduation-cap',
  'globe',
  'palette',
  'blocks',
  'badge-check',
  'brain',
  'table',
  'code',
  'languages',
  'presentation',
  'award',
  'mic',
  'medal',
  'image',
  'file-text',
  'link',
  'star',
];

export const allCategoryIconNames = iconNames;

export function normalizeIconName(name) {
  return String(name || fallbackIcon)
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function isValidLucideIcon(name) {
  return iconNames.includes(normalizeIconName(name));
}

export function CategoryIcon({ name, ...props }) {
  const normalized = normalizeIconName(name);
  const safeName = isValidLucideIcon(normalized) ? normalized : fallbackIcon;

  return <DynamicIcon name={safeName} aria-hidden="true" {...props} />;
}
