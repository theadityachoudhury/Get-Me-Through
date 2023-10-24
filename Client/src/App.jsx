import { Routes, Route } from "react-router-dom";

import "./App.css";
// import IndexPage from "./pages/IndexPage";
// import LoginPage from "./pages/LoginPage";

import Layout from "./Layout";
import RegistrationForm from "./pages/register";
import Test from "./pages/test";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import LoginForm from "./pages/login";
import EventAddForm from "./pages/event/add";
import EventPage from "./pages/event/event";
import LoginForm2 from "./pages/login2";
import Dashboard from "./pages/dashboard";

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
					{/* <Route index element={<IndexPage />} />
					<Route path="/account/:subpage?" element={<AccountPage />} />
					<Route path="/account/:subpage/:action" element={<AccountPage />} /> */}
					<Route path="/events/add" element={<EventAddForm />} />
					<Route path="/test" element={<Test />} />
					<Route path="/events" element={<EventPage />} />
					<Route path="/login2" element={<LoginForm />} />
					<Route path="/dashboard" element={<Dashboard/>}/>
					
				</Route>
				<Route path="/login" element={<LoginForm2 />} />
				<Route path="/register" element={<RegistrationForm />} />

				{/* <Route path="/login" element={<LoginPage />} />
				<Route path="/forget/:subpage?" element={<ForgetPassPage />} /> */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
