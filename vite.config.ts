import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['montra-icon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Montra – Quản lý thu chi',
        short_name: 'Montra',
        description: 'Quản lý thu chi cá nhân, local-first.',
        start_url: '/home',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#cd130a',
        background_color: '#e3e0e0',
        lang: 'vi',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/sw\.js$/, /^\/manifest\.webmanifest$/],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
