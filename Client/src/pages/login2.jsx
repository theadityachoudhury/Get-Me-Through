import { useState, useRef, useEffect, useContext } from "react";
import * as faceapi from "face-api.js";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import toast, { Toaster } from "react-hot-toast";

const LoginForm2 = () => {
	const [params] = useSearchParams();
	const callback = params.get("callback");
	if (callback == "/") return <Navigate to="/dashboard" />;

	const { setUser, user, ready } = useContext(UserContext);
	const [redirect, setRedirect] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { username, password, image } = formData;

		const data = JSON.stringify({
			username,
			password,
		});

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/api/auth/login",
			headers: {
				"Content-Type": "application/json",
			},
			data: data,
		};

		try {
			const response = await axios.request(config);
			toast.success("Success: " + response.data.message);
			await delay(3000);
			setUser(response.data.data);
			setFormData({
				username: "",
				password: "",
			});
			// setRedirect(true);
		} catch (error) {
			console.error(error);
			const errorData = error.response
				? error.response.data.message
				: "An unexpected error occurred!!";
			toast.error(errorData);
		}
	};

	if (user) {
		if (callback) {
			return <Navigate to={callback} />;
		}
		return <Navigate to="/dashboard" />;
	}

	if (!user && ready)
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
				<Toaster position="top-right" reverseOrder={true} />
				<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Get-Me-Through Login{" "}
					</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="username" className="block mb-2">
								Username:
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								className="border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="password" className="block mb-2">
								Password:
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="border border-gray-300 rounded px-2 py-1"
								required
							/>
							<p className="mb-3 text-right text-red">
								Forgot your password? <Link to="/forget">Reset Here</Link>
							</p>
						</div>

						<button
							type="submit"
							className="bg-green-500 text-white px-4 py-2 rounded">
							Login
						</button>
					</form>
					<p className="mt-3 text-center text-red">
						Don't have an account yet?{" "}
						{callback ? (
							<Link to={"/register?callback=" + callback}>Register Here</Link>
						) : (
							<Link to="/register">Register Here</Link>
						)}
					</p>
				</div>
			</div>
		);
};

export default LoginForm2;
