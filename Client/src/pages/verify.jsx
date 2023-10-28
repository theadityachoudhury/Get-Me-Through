import { useState, useRef, useEffect, useContext } from "react";
import * as faceapi from "face-api.js";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import toast, { Toaster } from "react-hot-toast";
import OTPInput from "./components/OTPInput";
import "../App.css";

const Verify = () => {
	const [params] = useSearchParams();
	const callback = params.get("callback");

	const { setUser, user, ready } = useContext(UserContext);
	const [formData, setFormData] = useState({
		otp: "",
	});

	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const handleInputChange = (e) => {
		setFormData({
			...formData,
			otp: e,
		});
	};

	const generate = async () => {
		try {
			const config = {
				method: "post",
				maxBodyLength: Infinity,
				url: "/api/auth/generate",
				headers: {
					"Content-Type": "application/json",
				},
				data: {
					username: user.username,
				},
			};

			const response = await axios.request(config);
			toast.success("Success: " + response.data.message);
		} catch (error) {
			console.error(error);
			const errorData = error.response
				? error.response.data.message
				: "An unexpected error occurred!!";
			toast.error(errorData);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		const { otp } = formData;

		const data = JSON.stringify({
			otp,
		});

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/api/auth/verify",
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				username: user.username,
				otp: otp,
			},
		};

		try {
			const response = await axios.request(config);
            toast.success("Success: " + response.data.message);
            toast.success("Login again to continue!!");
			await delay(3000);
			setUser(response.data.data);
			setFormData({
				otp: "",
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

	if (!user) {
		if (callback) {
			return <Navigate to={"/login?callback=" + callback} />;
		}
		return <Navigate to="/login" />;
	}

	if (user && ready && user.verified) {
		if (callback) {
			return <Navigate to={callback} />;
		}
		return <Navigate to="/" />;
	}

	if (user && ready && !user.verified)
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
				<Toaster position="top-right" reverseOrder={true} />
				<div className="w-full max-w-xl p-8 bg-white rounded shadow-md">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Get-Me-Through Verification Page{" "}
					</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="otp" className="block mb-2">
								OTP:
							</label>
							<OTPInput
								autoFocus
								length={6}
								className="otpContainer"
								inputClassName="otpInput text-xl"
								onChangeOTP={(otp) => handleInputChange(otp)}
							/>
						</div>

						<button
							type="submit"
							className="bg-green-500 text-white px-4 py-2 rounded">
							Verify
						</button>
					</form>
					<p className="mt-2 text-lg flex">
						Didn't got your OTP?{" "}
						<span>
							<button
								className="bg-white text-black hover:bg-black hover:text-white p-0 m-0 pl-1"
								onClick={generate}>
								Regenerate OTP
							</button>
						</span>
					</p>
				</div>
			</div>
		);
};

export default Verify;
