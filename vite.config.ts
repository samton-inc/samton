import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// 개발 서버에서 /insights/<slug>/ 게시물 경로가 insights/index.html로 열리게 한다.
// 배포본에서는 scripts/generate-insight-pages.mjs가 경로마다 정적 페이지를 생성한다.
const insightsArticleFallback = (): Plugin => ({
  name: 'insights-article-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && /^\/insights\/[^/.]+\/?(\?.*)?$/.test(req.url)) req.url = '/insights/'
      next()
    })
  },
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    insightsArticleFallback(),
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
