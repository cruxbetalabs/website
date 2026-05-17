import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base stays '/' because the site uses a custom domain (CNAME: cruxbeta.dev)
  base: '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    // Inline small assets to reduce HTTP requests
    assetsInlineLimit: 4096,
  },
})
