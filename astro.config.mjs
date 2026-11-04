// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://kustura.dev',
  // Downloaded at build time and served from the site itself (see <Font /> in Layout.astro)
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
