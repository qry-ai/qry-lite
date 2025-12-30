import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [preact(), tailwindcss()],
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'style.css';
					return 'assets/[name]-[hash][extname]';
				}
			}
		}
	},
	optimizeDeps: {
		include: ['@qry-ai/qry-lite-ui']
	}
});