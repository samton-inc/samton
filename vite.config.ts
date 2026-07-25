import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// 개발 서버에서 /insights/<slug>/ 게시물 경로와 /en, /ja 언어 경로가 알맞은 엔트리로 열리게 한다.
// 배포본에서는 scripts/generate-static-pages.mjs가 경로마다 정적 페이지를 생성한다.
const localizedRouteFallback = (): Plugin => ({
  name: 'localized-route-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url) return next()
      const [pathname, query] = req.url.split('?')
      const search = query ? `?${query}` : ''
      const path = pathname.replace(/^\/(en|ja)(?=\/|$)/, '') || '/'
      if (/^\/insights(?:\/[^/.]+)?\/?$/.test(path)) req.url = `/insights/${search}`
      else if (path === '/') req.url = `/${search}`
      next()
    })
  },
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localizedRouteFallback(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        insights: path.resolve(__dirname, 'insights/index.html'),
      },
    },
  },
})
