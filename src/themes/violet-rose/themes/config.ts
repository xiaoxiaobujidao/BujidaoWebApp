import type { ThemeId, ThemeMeta } from './types'

export const themes: Record<ThemeId, ThemeMeta> = {
  rose: {
    id: 'rose',
    name: '布吉岛',
    logo: '🥀',
    tagline: '紫夜玫瑰，畅通随心',
    footer: '布吉岛 · 紫夜玫瑰，畅通随心',
    themeColor: '#9c27b0',
  },
}

export function getTheme(id: ThemeId): ThemeMeta {
  return themes[id]
}
