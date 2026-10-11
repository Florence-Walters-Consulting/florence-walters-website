import type { Metadata } from 'next';
import BusinessAssessmentForm from '@/components/forms/BusinessAssessmentForm';

export const metadata: Metadata = { title: 'Business Assessment' };

export default function BusinessAssessment() {
	return <BusinessAssessmentForm />;
}
