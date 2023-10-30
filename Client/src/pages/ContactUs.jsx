import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../UserContext";

const ContactUs = () => {
	const { user, ready } = useContext(UserContext);
	const [formData, setFormData] = useState({
		username: user.username || "",
		name: user.name || "",
		email: user.email || "",
		message: "",
	});
	const [formErrors, setFormErrors] = useState({
		username: "",
		name: "",
		email: "",
		message: "",
	});
	const { username, name, email, message } = formData;

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear the error when user types
	};

	const validateForm = () => {
		let valid = true;
		const newFormErrors = { ...formErrors };

		if (name.trim() === "") {
			newFormErrors.name = "Name is required";
			valid = false;
		}
		if (username.trim() === "") {
			newFormErrors.username = "Username is required";
			valid = false;
		}

		if (email.trim() === "") {
			newFormErrors.email = "Email is required";
			valid = false;
		} else if (!isValidEmail(email)) {
			newFormErrors.email = "Invalid email format";
			valid = false;
		}

		if (message.trim() === "") {
			newFormErrors.message = "Message is required";
			valid = false;
		}

		setFormErrors(newFormErrors);
		return valid;
	};

	const isValidEmail = (email) => {
		// You can add a regular expression to validate email format
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				const response = await axios.post("/api/email/contact", formData);
				if (response.status === 200) {
					toast.success("Message sent successfully!", {
						icon: "🚀",
						style: {
							background: "#64B5F6",
							color: "#000",
						},
					});
					setFormData({
						name: "",
						email: "",
						message: "",
					});
				}
			} catch (error) {
				toast.error("Failed to send message. Please try again later.", {
					icon: "❌",
					style: {
						background: "#000080",
						color: "#FFF",
					},
				});
			}
		}
	};

	if (user && ready)
		return (
			<div className="bg-white text-white mt-20 flex flex-col justify-center items-center">
				<div className="bg-red-500 p-4 rounded-md">
					<h1 className="text-3xl font-bold">Contact Us</h1>
				</div>
				<div className="bg-black text-white p-4 mt-4 rounded-md w-96 lg:w-1/2 xl:w-1/3">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
							<label className="block text-lg">Username</label>
							<input
								type="text"
								className="w-full border border-black rounded-md p-2"
								name="username"
								value={username}
								onChange={handleChange}
								disabled={user.username}
							/>
							<div className="text-red-600 text-sm">{formErrors.name}</div>
						</div>
						<div>
							<label className="block text-lg">Name</label>
							<input
								type="text"
								className="w-full border border-black rounded-md p-2"
								name="name"
								value={name}
								onChange={handleChange}
								disabled={user.name}
							/>
							<div className="text-red-600 text-sm">{formErrors.name}</div>
						</div>
						<div>
							<label className="block text-lg">Email</label>
							<input
								type="email"
								className="w-full border border-black rounded-md p-2"
								name="email"
								value={email}
								onChange={handleChange}
								disabled={user.email}
							/>
							<div className="text-red-600 text-sm">{formErrors.email}</div>
						</div>
						<div>
							<label className="block text-lg">Message</label>
							<textarea
								className="w-full h-32 border border-black rounded-md p-2"
								name="message"
								value={message}
								onChange={handleChange}></textarea>
							<div className="text-red-600 text-sm">{formErrors.message}</div>
						</div>
						<button
							className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
							type="submit">
							Send Message
						</button>
					</form>
				</div>
			</div>
		);
};

export default ContactUs;
