import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../assets/Icon.svg";
import bg from "../assets/homesvg.svg";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);
	const { setUser, user } = useContext(UserContext);

	async function Login(ev) {
		ev.preventDefault();
		try {
			const res = await axios.post("/api/auth/login", { username, password });
			if (res.status === 200) {
				setUser(res.data.data);
				alert("Login Successful.");
				setRedirect(true);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				alert(err.response.status + "!! " + err.response.data.message);
			}
		}
	}

	if (redirect) {
		return <Navigate to={"/"} />;
	}

	return (
		<div className="bg-white">
			<div className="flex justify-center h-screen">
				<div
					className="hidden bg-cover lg:block lg:w-2/3"
					style={{
						backgroundImage: `url(${bg})`,
					}}>
					
					<div className="absolute top-0 left-20 mt-4 ml-4 text-center max-w-xs">
						<span
							className="text-black text-5xl font-bold"
							/* style={{ fontFamily: "Poppins" }} */
						>
							Fuzzy Spork
						</span>
					</div>
					          {/* <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-30">
            <div>
              <h2 className="text-4xl font-bold text-white">Brand</h2>

              <p className="max-w-xl mt-3 text-gray-300">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                autem ipsa, nulla laboriosam dolores, repellendus perferendis
                libero suscipit nam temporibus molestiae
              </p>
            </div>
          </div> */}
				</div>

				<div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
					<div className="flex-1">
						<div className="text-center">
							<h2 className="text-4xl font-bold text-center text-black">
								Fuzzy Spork
							</h2>

							<p className="mt-3 text-gray-700">
								Sign in to access your account
							</p>
						</div>

						<div className="mt-8">
							<form onSubmit={Login}>
								<div>
									<label
										htmlFor="username"
										className="block mb-2 text-sm text-gray-600">
										Username
									</label>
									<input
										id="username"
										type="text"
										name="username"
										value={username}
										onChange={(ev) => {
											setUsername(ev.target.value);
										}}
										placeholder="example@example.com"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>

								<div className="mt-6">
									<div className="flex justify-between mb-2">
										<label htmlFor="password" className="text-sm text-gray-600">
											Password
										</label>
										<Link
											to={"/forget"}
											className="text-sm text-gray-400 focus:text-FF432A hover:text-red-500 hover:underline">
											Forgot password?
										</Link>
									</div>

									<input
										id="password"
										type="password"
										name="password"
										value={password}
										onChange={(ev) => {
											setPassword(ev.target.value);
										}}
										placeholder="Your Password"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>

								<div className="mt-6">
									<button
										className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
										style={{ backgroundColor: "#ff432a" }}
										type="submit">
										Log in
									</button>
								</div>
							</form>

							<p className="mt-6 text-sm text-center text-gray-400">
								Don't have an account yet?{" "}
								<a
									href="/register"
									className="focus:outline-none focus:underline hover:underline"
									style={{ color: "#ff432a" }}>
									Sign up
								</a>
								.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
