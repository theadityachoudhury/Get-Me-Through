import { useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import logo from "../assets/Icon.svg";
import bg from "../assets/homesvg.svg";

export default function RegistePage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function registerUser(ev) {
		ev.preventDefault();
		try {
			const res = await axios.post("/api/auth/register", {
				name,
				email,
				password,
			});
			console.log(res);
			if (res.status === 200)
				alert("Registration Successful. Now you can login");
		} catch (err) {
			console.log(err);
			if (err instanceof AxiosError) {
				alert(err.response.status + "!! " + err.response.data.message);
			}
		}
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
							className="text-black text-4xl font-bold"
							/* style={{ fontFamily: "Poppins" }} */
						>
							Fuzzy Spork
						</span>
					</div>
					{/*           <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-30">
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
						<div className="text-left ">
							<h2 className="text-4xl font-bold text-left text-black">
								Registration
							</h2>
						</div>

						<div className="mt-8">
							<form>
								<div>
									<label
										htmlFor="firstname"
										className="block mb-2 text-sm text-gray-600">
										First Name
									</label>
									<input
										type="text"
										name="firstname"
										id="firstname"
										placeholder="Enter first name"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>

								<div className="mt-6">
									<label
										htmlFor="lastname"
										className="block mb-2 text-sm text-gray-600">
										Last Name
									</label>
									<input
										type="text"
										name="lastname"
										id="lastname"
										placeholder="Enter last name"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>
								<div className="mt-6">
									<label
										htmlFor="department"
										className="block mb-2 text-sm text-gray-600">
										Department
									</label>
									<input
										type="text"
										name="department"
										id="department"
										placeholder="Enter department"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600 border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>
								<div className="mt-6">
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Date of birth
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    placeholder="Enter Date"
                    className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Phone number
                  </label>
                  <input
                    type="password"
                    name="phone"
                    id="phone"
                    placeholder="Enter department"
                    className=" w-full px-4 py-2 mt-2 border-b-4 text-gray-300 placeholder-gray-600  border-b-black-800 rounded-lg dark:placeholder-gray-400 dark:bg-white dark:text-gray-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
                  />
                </div>
								<div className="mt-6">
									<label
										htmlFor="email"
										className="block mb-2 text-sm text-gray-600">
										Email
									</label>
									<input
										type="password"
										name="email"
										id="email"
										placeholder="Enter your email"
										className=" w-full px-4 py-2 mt-2 border-b-4 placeholder-black  border-b-black-800 rounded-lg  dark:bg-white focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>

								<div className="mt-6">
									<div className="flex justify-between mb-2">
										<label htmlFor="password" className="text-sm text-gray-600">
											Password
										</label>
									</div>

									<input
										type="password"
										name="password"
										id="password"
										placeholder="Enter your Password"
										className=" w-full px-4 py-2 mt-2 border-b-4 text-black-300 placeholder-black-600   border-b-black-800 rounded-lg dark:placeholder-black-400 dark:bg-black dark:text-black-700 dark:border-gray-300 focus:border-b-red-400 dark:focus:border-b-red-400  focus:outline-none  "
									/>
								</div>

								<div className="mt-6">
									<button
										className="w-full shadow-lg px-4 py-2 rounded-full tracking-wide text-white transition-colors duration-200 transform bg-orange-500 hover:bg-orange-400 focus:outline-none focus:bg-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
										style={{ backgroundColor: "#FF432A" }}>
										Register
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
