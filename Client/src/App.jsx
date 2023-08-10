import "./App.css";

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
					{/* <Route path="/stone" element={<StoneChip />} />
					<Route path="/account/:subpage?" element={<AccountPage />} />
					<Route path="/account/:subpage/:action" element={<AccountPage />} />
					<Route path="/register" element={<RegistePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/forget/:subpage?" element={<ForgetPassPage />} /> */}
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;
