import { useContext } from 'react';
import ImageContext from './ImageContext';

export function useImages() {
	return useContext(ImageContext);
}
