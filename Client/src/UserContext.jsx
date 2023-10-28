import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(null);
	const [ready, setReady] = useState(false);

	

	const fetchUser = () => {
		axios
			.get("/api/auth/user")
			.then((res) => {
				if (res.data === null) {
					setUser(null);
				} else {
					setUser(res.data.data);
				}
				setReady(true);
			})
			.catch((error) => {
				// Handle error, e.g., show error message or log the error
					console.error(error);
				setReady(true);
			});
	};

	const refreshAccessToken = async () => {
		await axios.get("/api/auth/refresh");
		fetchUser();
		// console.clear();
	};

	// useEffect(() => {
	//     if (!user) {
	//         axios.get('/api/auth/user').then((res) => {
	//             if (res.data === null) {
	//                 setUser(null);
	//             } else {
	//                 setUser(res.data.data)
	//             }
	//             setReady(true);
	//         });

	//     }
	// }, []);

	useEffect(() => {
		if (!user) {
			fetchUser();
		}
		if (user === null) {
			refreshAccessToken();
		}
		// console.clear();

		// Refresh the access token every 8 minutes
		const refreshAccessTokenInterval = setInterval(
			refreshAccessToken,
			0.4 * 60 * 1000
			// 10*1000
		);

		// Clean up the interval when the component unmounts
		return () => clearInterval(refreshAccessTokenInterval);
	}, [user]);

	return (
		<UserContext.Provider value={{ user, setUser, ready, setReady }}>
			{children}
		</UserContext.Provider>
	);
}
