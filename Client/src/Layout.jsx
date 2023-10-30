import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import { UserContext } from "./UserContext";
import { useContext } from "react";

export default function Layout() {
	const { user, ready } = useContext(UserContext);
	if (!user && ready) {
		const callbackurl = window.location.pathname;
		console.log(callbackurl);
		return <Navigate to={"/login?callback=" + callbackurl} />;
	}
	if (user && ready && !user.verified) {
		const callbackurl = window.location.pathname;
		console.log(callbackurl);
		return <Navigate to={"/verify?callback=" + callbackurl} />;
	}
	return (
		<div className="p-4 flex flex-col min-h-screen bg-gray-100">
			<Header />
			{user && ready && user.verified && <Outlet />}
		</div>
	);
}
