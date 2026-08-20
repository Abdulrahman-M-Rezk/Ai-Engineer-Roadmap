export type TabType = 'content' | 'resources' | 'tasks';

export interface DisplayResource {
  id: string;
  name: string;
  url?: string;
  desc?: string;
  isCustom: boolean;
  type?: 'video' | 'book' | 'article' | 'custom';
  lang?: 'ar' | 'en';
  price?: 'free' | 'paid';
  groupId?: string;
  referral?: { message: string; name: string; email: string };
}

export const RESOURCE_FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'video', label: '📹 فيديو' },
  { key: 'book', label: '📕 كتاب' },
  { key: 'article', label: '📄 مقال' },
  { key: 'ar', label: '🇪🇬 عربي' },
];

export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export const PULSE_CLASS: Record<string, string> = {
  '#00D4FF': 'animate-pulse-cyan',
  '#A78BFA': 'animate-pulse-purple',
  '#FB923C': 'animate-pulse-orange',
  '#34D399': 'animate-pulse-green',
  '#F472B6': 'animate-pulse-pink',
  '#FBBF24': 'animate-pulse-yellow',
  '#F87171': 'animate-pulse-red',
};