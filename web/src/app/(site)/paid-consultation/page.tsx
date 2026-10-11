import type { Metadata } from 'next';
import PaidConsultationForm from '@/components/forms/PaidConsultationForm';

export const metadata: Metadata = { title: 'Paid Consultation' };

export default function PaidConsultation() {
	return <PaidConsultationForm />;
}
