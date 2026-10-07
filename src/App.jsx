import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollUp from './services/ScrollUp';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceSingle from './pages/ServiceSingle';
import Blog from './pages/Blog';
import BlogSingle from './pages/BlogSingle';
import Contact from './pages/Contact';
import Cookies from './pages/Cookies';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import BusinessAssessment from './pages/BusinessAssessment';
import PaidConsultation from './pages/PaidConsultation';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const pageTitles = {
	'/': 'Home',
	'/about': 'About Us',
	'/services': 'Services',
	'/blog': 'Insights',
	'/contact': 'Contact Us',
	'/cookies': 'Cookie Policy',
	'/privacy': 'Privacy Policy',
	'/terms': 'Terms of Service',
};

function DocumentTitle() {
	const { pathname } = useLocation();

	useEffect(() => {
		let pageName = pageTitles[pathname];

		if (!pageName) {
			const slug = pathname.split('/').filter(Boolean).at(-1) || '';
			pageName = decodeURIComponent(slug)
				.replace(/[-_]+/g, ' ')
				.replace(/\b\w/g, (letter) => letter.toUpperCase());
		}

		document.title = `${pageName || 'Home'} - Florence Walters Consulting`;
	}, [pathname]);

	return null;
}

function App() {
	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
		});
	}, []);
	return (
		<Router>
			<DocumentTitle />
			<ScrollUp />
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/services" element={<Services />} />
					<Route path="/services/:slug" element={<ServiceSingle />} />
					<Route path="/blog" element={<Blog />} />
					<Route path="/blog/:slug" element={<BlogSingle />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/cookies" element={<Cookies />} />
					<Route path="/privacy" element={<Privacy />} />
					<Route path="/terms" element={<Terms />} />
					<Route path="/business-assessment" element={<BusinessAssessment />} />
					<Route path="/paid-consultation" element={<PaidConsultation />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
