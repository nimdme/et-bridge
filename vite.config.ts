import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function devImageProxyPlugin(): Plugin {
  return {
    name: 'dev-image-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/image-proxy') || req.url.startsWith('/api/file-proxy') || req.url.startsWith('/api/proxy'))) {
          try {
            const urlObj = new URL(req.url, 'http://localhost')
            const targetUrl = urlObj.searchParams.get('url')
            if (!targetUrl) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing url parameter' }))
              return
            }

            const token = urlObj.searchParams.get('token')
            const inst = urlObj.searchParams.get('inst')
            const parsedTarget = new URL(targetUrl)

            const forwardHeaders: Record<string, string> = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': `${parsedTarget.origin}/`,
              'Origin': parsedTarget.origin
            }
            if (token) forwardHeaders['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
            if (inst) forwardHeaders['X-Institute-ID'] = inst

            let response = await fetch(targetUrl, { headers: forwardHeaders })

            if (!response.ok && inst && parsedTarget.hostname === 'api.students.etlab.app') {
              const altUrl = targetUrl.replace('api.students.etlab.app', `${inst}.etlab.app`)
              const altHeaders = { ...forwardHeaders, Referer: `https://${inst}.etlab.app/`, Origin: `https://${inst}.etlab.app` }
              const altRes = await fetch(altUrl, { headers: altHeaders }).catch(() => null)
              if (altRes && altRes.ok) response = altRes
            } else if (!response.ok && inst && parsedTarget.hostname.includes(`${inst}.etlab.app`)) {
              const altUrl = targetUrl.replace(`${inst}.etlab.app`, 'api.students.etlab.app')
              const altHeaders = { ...forwardHeaders, Referer: `https://api.students.etlab.app/`, Origin: `https://api.students.etlab.app` }
              const altRes = await fetch(altUrl, { headers: altHeaders }).catch(() => null)
              if (altRes && altRes.ok) response = altRes
            }
            res.statusCode = response.status
            const contentType = response.headers.get('content-type') || (targetUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
            res.setHeader('Content-Type', contentType)
            const disposition = response.headers.get('content-disposition')
            if (disposition) res.setHeader('Content-Disposition', disposition)
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
            res.setHeader('Cache-Control', 'public, max-age=86400')

            const arrayBuffer = await response.arrayBuffer()
            res.end(Buffer.from(arrayBuffer))
            return
          } catch (err: any) {
            res.statusCode = 502
            res.end(JSON.stringify({ error: 'Proxy error', details: err?.message }))
            return
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    devImageProxyPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png',
        'img/favicon/favicon.ico',
        'img/favicon/favicon-16x16.png',
        'img/favicon/favicon-32x32.png',
        'img/favicon/apple-touch-icon.png',
        'img/favicon/android-chrome-192x192.png',
        'img/favicon/android-chrome-512x512.png',
        'img/logo/logo-dark.png',
        'img/logo/logo-light.png'
      ],
      manifest: {
        name: 'ETBridge Student Portal',
        short_name: 'ETBridge',
        description: 'Clean, distraction-free, high-performance student client for ETLab',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/dashboard',
        scope: '/',
        icons: [
          {
            src: '/img/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/img/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/img/favicon/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.students.etlab.app',
        changeOrigin: true,
        headers: {
          'Origin': 'https://students.etlab.app',
          'Referer': 'https://students.etlab.app/'
        }
      }
    }
  }
})
