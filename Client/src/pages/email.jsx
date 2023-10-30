import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import Loader from "./components/Loader";

// Custom hook for handling the timer
const useRefreshTimer = () => {
	const [remainingSeconds, setRemainingSeconds] = useState(30);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const resetTimer = () => {
		setRemainingSeconds(30);
		setIsRefreshing(true);
	};

	useEffect(() => {
		let intervalId;

		if (isRefreshing) {
			intervalId = setInterval(() => {
				setRemainingSeconds((prevSeconds) => {
					if (prevSeconds === 1) {
						clearInterval(intervalId);
						setIsRefreshing(false);
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [isRefreshing]);

	return { remainingSeconds, isRefreshing, resetTimer };
};

const Email = () => {
	const { ready, user } = useContext(UserContext);
	const [emailData, setEmailData] = useState(null);
	const [data, setData] = useState(false);
	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const fetchEmailData = () => {
		axios
			.get("/api/email/logs")
			.then(async (response) => {
				setEmailData(response.data);
				setData(true);
			})
			.catch((error) => {
				console.log(error);
				let message = error.response.data.message || error.message;
				toast.error(message);
				// toast.error("Unable to fetch data!!");
			});
	};

	const formatDateTime = (dateTimeString) => {
		if (!dateTimeString) {
			return "";
		}
		const dateTime = new Date(dateTimeString);
		const formattedDateTime = dateTime.toLocaleString();
		return formattedDateTime;
	};

	const refreshData = () => {
		resetTimer(); // Reset the timer
		setData(false);
		fetchEmailData(); // Fetch data immediately
	};

	const { remainingSeconds, isRefreshing, resetTimer } = useRefreshTimer();

	useEffect(() => {
		// Fetch data when the component mounts
		refreshData();

		// Set up an interval to refresh data every 30 seconds
		const autoRefreshInterval = setInterval(() => {
			if (!isRefreshing) {
				refreshData();
			}
		}, 30000);

		return () => {
			clearInterval(autoRefreshInterval); // Clean up the interval when the component unmounts
		};
	}, [isRefreshing]);

	if (ready) {
		if (user && user.role === "admin") {
			if (data) {
				return (
					<div className="bg-white shadow-md rounded px-8 py-4 mb-4">
						<div className="pl-96 text-center flex">
							<h1 className="text-7xl text-center font-semibold mb-2 mr-2">
								Email Logs Admin View
							</h1>
							<button
								className="w-40 h-20 bg-blue-500 text-white py-1 px-4 rounded-md hover-bg-blue-700"
								onClick={refreshData}>
								Refresh ({remainingSeconds}s)
							</button>
						</div>

						<hr className="mb-2"></hr>
						{emailData.map((email, index) => (
							<div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
								<table className="table-auto w-full">
									<tbody>
										<tr>
											<td className="font-semibold">Username:</td>
											<td>{email.username}</td>
										</tr>
										<tr>
											<td className="font-semibold">To:</td>
											<td>{email.to.join(", ")}</td>
										</tr>
										<tr>
											<td className="font-semibold">Subject:</td>
											<td>{email.subject}</td>
										</tr>
										<tr>
											<td className="font-semibold">Body:</td>
											<td
												dangerouslySetInnerHTML={{
													__html: email.body,
												}}></td>
										</tr>
										<tr>
											<td className="font-semibold">Status:</td>
											<td>{email.status}</td>
										</tr>
										<tr>
											<td className="font-semibold">Type:</td>
											<td>{email.type}</td>
										</tr>
										<tr>
											<td className="font-semibold">Sent At:</td>
											<td>{formatDateTime(email.createdAt)}</td>
										</tr>
										<tr className="mb-4">
											<td className="font-semibold">Message ID:</td>
											<td>{email.messageId}</td>
										</tr>
									</tbody>
								</table>
							</div>
						))}
					</div>
				);
			} else {
				return (
					<div>
						<div className="pl-96 text-center flex">
							<h1 className="text-7xl text-center font-semibold mb-2 mr-2">
								Email Logs Admin View
							</h1>
							<button
								className="w-40 h-20 bg-blue-500 text-white py-1 px-4 rounded-md hover-bg-blue-700"
								onClick={refreshData}
								disabled>
								Refresh ({remainingSeconds}s)
							</button>
						</div>
						<Loader />
					</div>
				);
			}
		} else {
			return <Navigate to={"/"} />;
		}
	}
};

export default Email;
