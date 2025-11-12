
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to your Vercel deployment
      '/api': {
        target: 'https://chat-bot-dukkan-v3.vercel.app', // Your production URL
        changeOrigin: true,
        // No rewrite needed as the backend path is also /api/chat
      },
    },
  },
});
