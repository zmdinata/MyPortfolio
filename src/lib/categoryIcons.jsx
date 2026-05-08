import {
  Award,
  BadgeCheck,
  Blocks,
  BookOpen,
  Brain,
  Briefcase,
  ChartBar,
  Code,
  Cpu,
  Database,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  Image,
  Languages,
  Link,
  Medal,
  Mic,
  Palette,
  Presentation,
  ShieldCheck,
  Star,
  Table,
  Trophy,
} from 'lucide-react';

const fallbackIcon = 'folder';

const iconRegistry = {
  award: Award,
  'badge-check': BadgeCheck,
  blocks: Blocks,
  'book-open': BookOpen,
  brain: Brain,
  briefcase: Briefcase,
  'chart-bar': ChartBar,
  code: Code,
  cpu: Cpu,
  database: Database,
  'file-text': FileText,
  folder: Folder,
  globe: Globe,
  'graduation-cap': GraduationCap,
  image: Image,
  languages: Languages,
  link: Link,
  medal: Medal,
  mic: Mic,
  palette: Palette,
  presentation: Presentation,
  'shield-check': ShieldCheck,
  star: Star,
  table: Table,
  trophy: Trophy,
};

export const commonCategoryIcons = Object.keys(iconRegistry);
export const allCategoryIconNames = commonCategoryIcons;

export function normalizeIconName(name) {
  return String(name || fallbackIcon)
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function isValidLucideIcon(name) {
  return Boolean(iconRegistry[normalizeIconName(name)]);
}

export function CategoryIcon({ name, ...props }) {
  const normalized = normalizeIconName(name);
  const Icon = iconRegistry[normalized] || iconRegistry[fallbackIcon];

  return <Icon aria-hidden="true" {...props} />;
}
