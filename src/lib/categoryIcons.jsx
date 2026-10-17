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
