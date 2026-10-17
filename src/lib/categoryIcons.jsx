import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  Binary,
  Blocks,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Briefcase,
  ChartBar,
  Check,
  Cloud,
  Code,
  Compass,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Flame,
  Folder,
  Gauge,
  GitBranch,
  Globe,
  GraduationCap,
  Image,
  Languages,
  Layers,
  LineChart,
  Link,
  Medal,
  MessageSquare,
  Mic,
  Network,
  Palette,
  Presentation,
  Rocket,
  Send,
  Server,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Table,
  Terminal,
  TrendingUp,
  Trophy,
  Workflow,
  Zap,
  icons,
} from 'lucide-react';

const fallbackIcon = 'folder';

const iconRegistry = {
  activity: Activity,
  award: Award,
  'badge-check': BadgeCheck,
  badgecheck: BadgeCheck,
  'bar-chart': BarChart3,
  'bar-chart-3': BarChart3,
  barchart: BarChart3,
  binary: Binary,
  blocks: Blocks,
  'book-open': BookOpen,
  bookopen: BookOpen,
  bot: Bot,
  boxes: Boxes,
  brain: Brain,
  briefcase: Briefcase,
  'chart-bar': ChartBar,
  chartbar: ChartBar,
  check: Check,
  cloud: Cloud,
  code: Code,
  compass: Compass,
  copy: Copy,
  cpu: Cpu,
  database: Database,
  'external-link': ExternalLink,
  'file-text': FileText,
  filetext: FileText,
  flame: Flame,
  folder: Folder,
  gauge: Gauge,
  'git-branch': GitBranch,
  gitbranch: GitBranch,
  globe: Globe,
  'graduation-cap': GraduationCap,
  graduationcap: GraduationCap,
  image: Image,
  languages: Languages,
  layers: Layers,
  'line-chart': LineChart,
  linechart: LineChart,
  link: Link,
  medal: Medal,
  'message-square': MessageSquare,
  messagesquare: MessageSquare,
  mic: Mic,
  network: Network,
  palette: Palette,
  presentation: Presentation,
  rocket: Rocket,
  send: Send,
  server: Server,
  shield: Shield,
  'shield-check': ShieldCheck,
  shieldcheck: ShieldCheck,
  sliders: Sliders,
  sparkles: Sparkles,
  star: Star,
  table: Table,
  terminal: Terminal,
  'trending-up': TrendingUp,
  trendingup: TrendingUp,
  trophy: Trophy,
  workflow: Workflow,
  zap: Zap,
};

export const suggestedDeckIcons = [
  { id: 'cpu', label: 'CPU / Hardware', name: 'cpu' },
  { id: 'bot', label: 'AI Agent / Bot', name: 'bot' },
  { id: 'brain', label: 'Brain / Intelligence', name: 'brain' },
  { id: 'sparkles', label: 'Sparkles / GenAI', name: 'sparkles' },
  { id: 'zap', label: 'Zap / Fast Execution', name: 'zap' },
  { id: 'workflow', label: 'Workflow / Pipeline', name: 'workflow' },
  { id: 'cloud', label: 'Cloud Run / Deploy', name: 'cloud' },
  { id: 'server', label: 'Server / Backend', name: 'server' },
  { id: 'terminal', label: 'Terminal / CLI', name: 'terminal' },
  { id: 'code', label: 'Code / Software', name: 'code' },
  { id: 'activity', label: 'Activity / Telemetry', name: 'activity' },
  { id: 'line-chart', label: 'Line Chart / ML', name: 'line-chart' },
  { id: 'database', label: 'Database / SQL', name: 'database' },
  { id: 'rocket', label: 'Rocket / Production', name: 'rocket' },
  { id: 'network', label: 'Network / Architecture', name: 'network' },
  { id: 'layers', label: 'Layers / System', name: 'layers' },
];

export function normalizeIconName(name) {
  return String(name || fallbackIcon)
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function toKebabCase(str) {
  return String(str || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

export function toPascalCase(str) {
  return String(str || '')
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/(^|-)([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase());
}

// Full array of all 1,700+ Lucide icons in kebab-case format
export const allCategoryIconNames = icons
  ? Array.from(
      new Set([
        ...Object.keys(iconRegistry),
        ...Object.keys(icons).map(toKebabCase),
      ])
    ).sort()
  : Object.keys(iconRegistry);

// Curated list of 80+ high-frequency, top-relevant icons for instant viewing
export const commonCategoryIcons = [
  // AI, LLM & Machine Learning
  'cpu', 'bot', 'brain', 'brain-circuit', 'brain-cog', 'sparkles', 'activity', 'binary',
  // Cloud, Backend, Workflow & DevOps
  'zap', 'workflow', 'cloud', 'cloud-cog', 'cloud-rain', 'server', 'server-cog', 'terminal',
  'database', 'database-backup', 'network', 'layers', 'git-branch', 'git-commit', 'git-pull-request',
  // Development & Architecture
  'code', 'code-2', 'boxes', 'box', 'package', 'container', 'blocks',
  'flame', 'rocket', 'gauge', 'sliders', 'settings', 'wrench', 'shield', 'shield-check',
  // Data, Charts & Statistics
  'chart-bar', 'chart-line', 'chart-pie', 'chart-area', 'chart-network', 'trending-up', 'table',
  // Education, Achievements & Portfolio
  'award', 'badge-check', 'trophy', 'medal', 'star', 'graduation-cap', 'book-open', 'bookmark',
  'briefcase', 'file-text', 'folder', 'folder-git-2', 'globe', 'languages', 'presentation',
  // Communication, Tools & Controls
  'message-square', 'send', 'mail', 'link', 'external-link', 'image', 'palette', 'mic',
  'compass', 'eye', 'search', 'check', 'copy',
];

export const CATEGORY_ICON_GROUPS = [
  {
    id: 'ai',
    label: 'AI & ML',
    icons: ['cpu', 'bot', 'brain', 'brain-circuit', 'brain-cog', 'sparkles', 'activity', 'binary'],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    icons: ['zap', 'workflow', 'cloud', 'cloud-cog', 'server', 'server-cog', 'terminal', 'database', 'network', 'layers', 'git-branch'],
  },
  {
    id: 'dev',
    label: 'Code & Software',
    icons: ['code', 'code-2', 'boxes', 'box', 'package', 'blocks', 'flame', 'rocket', 'gauge', 'sliders', 'settings', 'wrench'],
  },
  {
    id: 'data',
    label: 'Data & Charts',
    icons: ['chart-bar', 'chart-line', 'chart-pie', 'chart-area', 'chart-network', 'trending-up', 'table'],
  },
  {
    id: 'achieve',
    label: 'Prestasi & Karir',
    icons: ['award', 'badge-check', 'trophy', 'medal', 'star', 'graduation-cap', 'book-open', 'briefcase', 'file-text', 'globe'],
  },
];

export function isValidLucideIcon(name) {
  const normalized = normalizeIconName(name);
  if (iconRegistry[normalized]) return true;
  const pascal = toPascalCase(normalized);
  return Boolean(icons && icons[pascal]);
}

export function CategoryIcon({ name, ...props }) {
  const normalized = normalizeIconName(name);
  // 1. Direct registry alias match
  if (iconRegistry[normalized]) {
    const Component = iconRegistry[normalized];
    return <Component aria-hidden="true" {...props} />;
  }
  // 2. Dynamic PascalCase lookup in icons
  const pascal = toPascalCase(normalized);
  const IconComponent = (icons && icons[pascal]) || iconRegistry[fallbackIcon] || icons?.['Folder'];

  return IconComponent ? <IconComponent aria-hidden="true" {...props} /> : null;
}
