import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// --- Passo de Depuração ---
const resolvedSrcPath = path.resolve(__dirname, './src');
console.log('--- VITE CONFIG DEBUG ---');
console.log('Alias "@" está sendo resolvido para o caminho:', resolvedSrcPath);
console.log('-------------------------');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolvedSrcPath },
  },
})