import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact(), tailwindcss()],
	optimizeDeps: {
		include: ['@qry-ai/qry-lite-ui']
	}
});
