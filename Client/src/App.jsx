import { Routes, Route } from "react-router-dom";

import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";

import Layout from "./Layout";
import RegistePage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";
import ForgetPassPage from "./pages/ForgetPassPage";

// axios.defaults.baseURL = "http://localhost:5000";

const baseURL =
	window.location.hostname === "frontend.unknownclub.me"
		? "https://backend.unknownclub.me"
		: "http://localhost:5000";
// console.log(baseURL);

axios.defaults.baseURL = baseURL;

axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<IndexPage />} />
					<Route path="/account/:subpage?" element={<AccountPage />} />
					<Route path="/account/:subpage/:action" element={<AccountPage />} />
				</Route>
				<Route path="/register" element={<RegistePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forget/:subpage?" element={<ForgetPassPage />} />
			</Routes>
		</UserContextProvider>
	);
}

export default App;
