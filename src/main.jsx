import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './services/ErrorBoundary.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GeneralImagesProvider from './context/GeneralImagesProvider';

import './assets/fonts/fonts.css';
import './assets/icon/icomoon/style.css';
import './assets/css/bootstrap.min.css';
import './assets/css/animate.css';
import './assets/css/styles.css';
import './assets/css/figma-home.css';
import './assets/css/service-card-fix.css';
import './assets/css/figma-overrides.css';
import './assets/css/brand.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/js/plugin/swiper-bundle.min.js';
//import './assets/js/plugin/bootstrap-select.min.js';
//import './assets/js/plugin/wow.min.js';
import './assets/js/plugin/count-down.js';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<GeneralImagesProvider>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</GeneralImagesProvider>
		</QueryClientProvider>
	</StrictMode>,
);
