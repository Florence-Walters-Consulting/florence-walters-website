'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export default function AosInit() {
	useEffect(() => {
		AOS.init({ duration: 800, once: true });
	}, []);
	return null;
}
