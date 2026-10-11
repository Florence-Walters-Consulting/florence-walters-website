import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// Local PHP backend: run `php -S localhost:8000` from the project root.
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
			},
			'/site_img': {
				target: 'http://localhost:8000',
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			// 2. Define your alias mapping pointing to your src folder
			'@': path.resolve(__dirname, './src'),
		},
	},
});
