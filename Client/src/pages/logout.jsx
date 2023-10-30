import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import Loader from "./components/Loader";
import { Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Logout() {
	const { user, setUser, ready } = useContext(UserContext);
	useEffect(() => {
		axios
			.post("/api/auth/logout")
			.then((response) => {})
			.catch((error) => {
				console.error("Error fetching event data:", error);
			});
		setUser(null);
	}, []);

	if (!ready) {
		<Loader />;
	}

	if (ready && !user) {
		return <Navigate to={"/login"} />;
	}
}
