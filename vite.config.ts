import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'widget') {
    return {
      root: path.resolve(__dirname, 'src/widget'),
      build: {
        outDir: path.resolve(__dirname, 'dist/widget'),
        rollupOptions: {
          input: path.resolve(__dirname, 'src/widget/index.html')
        }
      }
    };
  }

  if (mode === 'loader') {
    return {
      root: path.resolve(__dirname, 'src/loader'),
      build: {
        outDir: path.resolve(__dirname, 'dist/loader'),
        lib: {
          entry: path.resolve(__dirname, 'src/loader/index.ts'),
          name: 'AuthWidget',
          fileName: 'auth-widget',
          formats: ['iife']
        },
        rollupOptions: {
          output: {
          }
        }
      }
    };
  }

  return {};
});
