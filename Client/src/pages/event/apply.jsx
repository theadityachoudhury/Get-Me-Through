import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EventApplyPage = ({ match }) => {
	const { eventId } = useParams();
	const { ready, user } = useContext(UserContext);
	const [eventData, setEventData] = useState(null);
	const [applied, setApplied] = useState(false);
	const [data, setData] = useState(false);
	useEffect(() => {
		axios
			.get(`/api/events/${eventId}`)
			.then((response) => {
				setEventData(response.data);
				axios
					.get(`/api/events/applied/${eventId}`)
					.then((response) => {
						if (response.status == 200) setApplied(true);
					})
					.catch((error) => {
						console.log(error);
						if (error.response.status == 404) toast.error("Not yet applied!!");
						else toast.error("Something went wrong");
					});
				setData(true);
			})
			.catch((error) => {
				toast.error("Something Went Wrong!!");
				toast.error("Unable to fetch data!!");
			});
	}, []);

	const formatDate = (dateString) => {
		// Check if the date string is provided
		if (!dateString) {
			return "";
		}
		// Create a Date object from the date string
		const date = new Date(dateString);
		// Format the date to "yyyy-MM-dd"
		const formattedDate = date.toISOString().split("T")[0];
		return formattedDate;
	};

	const handleApply = (e) => {
		e.preventDefault();
		console.log("Clicked");
		axios
			.get(`/api/events/apply/${eventId}`)
			.then((response) => {
				if (response.status == 201) {
					setApplied(true);
					toast.success("Successfully applied to the event!!");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	if (user && ready && data) {
		return (
			<div className="bg-white shadow-md rounded px-8 py-4 mb-4">
				<h2 className="text-2xl font-semibold mb-2">{eventData.title}</h2>
				<table className="table-auto w-full">
					<tbody>
						<tr>
							<td className="font-semibold">Description:</td>
							<td className="">
								<div className="mb-2">{eventData.description}</div>
							</td>
						</tr>

						<tr>
							<td className="font-semibold">Date:</td>
							<td>
								<div className="mb-2">{formatDate(eventData.date)}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Location:</td>
							<td>
								<div className="mb-2">{eventData.location}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Organizer:</td>
							<td>
								<div className="mb-2">{eventData.organizer}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Category:</td>
							<td>
								<div className="mb-2">{eventData.category}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Registration Fee:</td>
							<td>
								<div className="mb-2">
									{eventData.registrationFee === 0
										? "Free"
										: `$${eventData.registrationFee}`}
								</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Capacity:</td>
							<td>
								<div className="mb-2">{eventData.capacity}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">No of Participants:</td>
							<td>
								<div className="mb-2">{eventData.applied}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Registration Deadline:</td>
							<td>
								<div className="mb-2">
									{formatDate(eventData.registrationDeadline)}
								</div>
							</td>
						</tr>
						<tr className="mb-4">
							<td className="font-semibold">Status:</td>
							<td>
								<div className="mb-5">{eventData.status}</div>
							</td>
						</tr>
						<tr>
							<td className="font-semibold">Tags:</td>
							<td>
								<div className="mb-2">
									{eventData.tags.map((tag, index) => (
										<span
											key={index}
											className="mr-2 bg-gray-200 px-2 py-1 rounded">
											{tag}
										</span>
									))}
								</div>
							</td>
						</tr>

						<tr>
							<td className="font-semibold">Application Status</td>
							<td>
								<div className="py-2 w-1/4 h-16">
									{applied ? (
										"Applied"
									) : eventData.applied >= eventData.capacity ? (
										"Registrations Closed. Max capacity reached!!"
									) : (
										<button onClick={handleApply} className="">
											Apply Now
										</button>
									)}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
};

export default EventApplyPage;
