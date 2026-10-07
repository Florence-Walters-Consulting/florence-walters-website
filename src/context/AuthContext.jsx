import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContextValue';
import { api } from '@/services/api';

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = useCallback(async () => {
		try {
			const result = await api('/api/auth/me.php');

			if (result.data?.authenticated) {
				setUser(result.data.user);
			} else {
				setUser(null);
			}
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await api('/api/auth/logout.php', {
				method: 'POST',
			});
		} finally {
			setUser(null);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			void refreshUser();
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, [refreshUser]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				setUser,
				refreshUser,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
