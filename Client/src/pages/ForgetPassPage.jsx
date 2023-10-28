import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./components/Loader";

export default function ForgetPassPage() {
	let { subpage } = useParams();
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cpassword, setCpassword] = useState("");
	const [validLink, setValidLink] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [resetSuccess, setResetSuccess] = useState(false);

	useEffect(() => {
		if (subpage) {
			isValid(subpage);
		} else {
			setLoading(false);
		}
	}, [subpage]);

	async function isValid(sub) {
		try {
			const res = await axios.get("/api/auth/forget/" + sub);
			setValidLink(true);
			setLoading(false);
		} catch (err) {
			setValidLink(false);
			setLoading(false);
		}
	}

	async function ResetPassword(ev) {
		ev.preventDefault();
		try {
			const res = await axios.post("/api/auth/forget", { email });
			if (res.status === 200) {
				alert("Check your E-Mail for Password Reset Link");
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				alert(err.response.status + "!! " + err.response.data.message);
			}
		}
	}

	async function SaveResetPassword(ev) {
		ev.preventDefault();
		try {
			const res = await axios.post("/api/auth/forget/save", {
				password: password,
				otp: subpage,
			});
			if (res.status === 200) {
				setResetSuccess(true);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				alert(err.response.status + "!! " + err.response.data.message);
			}
		}
	}

	if (loading) {
		return <Loader />;
	}

	if (subpage && !validLink) {
		return (
			<div className="flex justify-center text-center items-center h-screen">
				<div className="">
					<h1 className="font-bold text-5xl">Password Reset Portal</h1>
					<div
						className="bg-red-100 border border-red-400 text-red-700 mt-5 px-4 py-3 rounded relative"
						role="alert">
						<strong className="font-bold">Holy smokes! </strong>
						<span className="block sm:inline">Invalid Password Reset Link</span>
					</div>
					<div className="flex mt-7 justify-center items-center">
						<Link to={"/login"} className="flex gap-2 hover:text-red">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
							<p>Back to Login</p>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (validLink && subpage) {
		if (resetSuccess) {
			return (
				<div className="flex justify-center text-center items-center h-screen">
					<div className="">
						<h1 className="font-bold text-5xl">Password Reset Portal</h1>
						<div className="text-green-500">Password Reset Successful</div>
					</div>
				</div>
			);
		}

		return (
			<div className="flex justify-center text-center items-center h-screen">
				<div className="">
					<h1 className="font-bold text-5xl">Password Reset Portal</h1>
					<form
						className="flex justify-center m-5"
						onSubmit={SaveResetPassword}>
						<div>
							<h2 className="text-xl">Enter New Password</h2>
							<input
								className="text-xl text-center"
								type="password"
								placeholder=""
								value={password}
								required
								onChange={(ev) => {
									setPassword(ev.target.value);
								}}
							/>
							<h2 className="text-xl mt-2">Enter Confirm Password</h2>
							<input
								className="text-xl text-center"
								type="password"
								placeholder=""
								value={cpassword}
								required
								onChange={(ev) => {
									setCpassword(ev.target.value);
								}}
							/>
							<button className="mt-5" style={{ backgroundColor: "#ff432a" }}>
								Reset Password
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center text-center items-center h-screen">
			<div className="">
				<h1 className="font-bold text-5xl">Password Reset Portal</h1>
				<form className="flex justify-center m-5" onSubmit={ResetPassword}>
					<div>
						<h2 className="text-xl">Enter your Email-Id</h2>
						<input
							className="text-xl text-center"
							type="email"
							placeholder="you@you.com"
							value={email}
							required
							onChange={(ev) => {
								setEmail(ev.target.value);
							}}
						/>
						<button className="mt-5" style={{ backgroundColor: "#ff432a" }}>
							Reset Password
						</button>
						<div className="flex mt-10 justify-center items-center">
							<Link to={"/login"} className="flex gap-2 hover:text-red">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
									/>
								</svg>
								<p>Back to Login</p>
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
