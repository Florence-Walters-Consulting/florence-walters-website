import ImageContext from './ImageContext';

import { useGeneralImages } from '../hooks/useGeneralImages';

function GeneralImagesProvider({ children }) {
	const { data, isLoading, error } = useGeneralImages();

	if (isLoading) {
		return null;
	}

	if (error) {
		return <div>Failed to load site images.</div>;
	}

	const imageItems = Array.isArray(data?.data) ? data.data : [];

	const images = imageItems.reduce((acc, item) => {
		acc[item.picture] = `/site_img/general/${item.size}`;

		return acc;
	}, {});

	return (
		<ImageContext.Provider value={images}>{children}</ImageContext.Provider>
	);
}

export default GeneralImagesProvider;
