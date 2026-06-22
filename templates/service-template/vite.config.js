import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Uncomment and set to your GitHub repo name when deploying to GitHub Pages:
  // base: '/your-repo-name/',
})
