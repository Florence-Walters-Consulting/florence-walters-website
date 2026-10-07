import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<main id="wrapper">
			<Header />
			<Outlet />
			<Footer />
		</main>
	);
}
