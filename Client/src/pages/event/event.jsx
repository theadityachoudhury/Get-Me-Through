import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { Link } from "react-router-dom";
import EventModalView from "../components/EventsModals/EventModalView";
import EventModalEdit from "../components/EventsModals/EventModalEdit";
import toast from "react-hot-toast";

const EventPage = () => {
	const { ready, user } = useContext(UserContext);
	const [events, setEvents] = useState([]);
	const [selectedEventForView, setSelectedEventForView] = useState(null);
	const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);

	const handleViewClick = async (event) => {
		const { data } = await axios.get(`/api/events/${event._id}`);
		setSelectedEventForView(data);
	};

	const handleEditClick = async (event) => {
		const { data } = await axios.get(`/api/events/${event._id}`);
		setSelectedEventForEdit(data);
	};

	const handleCloseModal = () => {
		setSelectedEventForView(null);
		setSelectedEventForEdit(null);
	};

	useEffect(() => {
		axios
			.get("/api/events")
			.then((response) => {
				const eventData = response.data;
				setEvents(eventData);
			})
			.catch((error) => {
				console.error("Error fetching event data:", error);
			});
	}, []);

	const handleDelete = (eventId) => {
		axios
			.delete(`/api/events/${eventId}`)
			.then((response) => {
				if (response.status === 200) {
					setEvents((prevEvents) =>
						prevEvents.filter((event) => event._id !== eventId)
					);
					toast.success("Event deleted successfully");
					
				}
			})
			.catch((error) => {
				console.error("Error deleting event:", error);
				toast.error("Unable to delete event!!");
			});
	};

	const handleEscapeKey = (event) => {
		if (event.key === "Escape") {
			handleCloseModal();
		}
	};

	useEffect(() => {
		// Add event listener to listen for "Esc" key press
		document.addEventListener("keydown", handleEscapeKey);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, []);

	const handleEditSuccess = (editedEvent) => {
		// Find the index of the edited event in the current events array
		const editedIndex = events.findIndex(
			(event) => event._id === editedEvent._id
		);

		if (editedIndex !== -1) {
			// Clone the current events array to avoid mutating state directly
			const updatedEvents = [...events];
			// Update the event at the edited index with the edited data
			updatedEvents[editedIndex] = editedEvent;
			// Set the updated events array in state
			setEvents(updatedEvents);
		}

		// Close the edit modal
		setSelectedEventForEdit(null);
	};

	if (user && ready) {
		return (
			<div className="event-page p-6 bg-gray-100 mb-10">
				<div className="flex items-center">
					<h1 className="text-5xl font-semibold text-gray-800">EVENTS</h1>
					{user.role === "admin" && (
						<Link to="/events/add" className="ml-4">
							<button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
								Add Event
							</button>
						</Link>
					)}
				</div>

				<table className="min-w-full divide-y divide-gray-200">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Event Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Event Description
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Host
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Max Participation
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{events.map((event, index) => (
							<tr key={index} className="bg-white">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{event.title}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{event.description}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{event.organizer}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Intl.DateTimeFormat("en-US", {
										dateStyle: "short",
									}).format(new Date(event.date))}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{event.capacity}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<button
										className="mr-2 text-black p-1 w-16 h-8 bg-blue-200 hover:bg-blue-300"
										onClick={() => handleViewClick(event)}>
										View
									</button>

									{user.role === "admin" && (
										<>
											<button
												className="mr-2 text-black p-1 w-16 h-8 bg-green-200 hover:bg-green-300"
												onClick={() => handleEditClick(event)}>
												Edit
											</button>
											<button
												className="text-black p-1 w-16 h-8 bg-red-200 hover.bg-red-300"
												onClick={() => handleDelete(event._id)}>
												Delete
											</button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{selectedEventForView && (
					<EventModalView
						event={selectedEventForView}
						isOpen={selectedEventForView !== null}
						onClose={handleCloseModal}
					/>
				)}
				{selectedEventForEdit && (
					<EventModalEdit
						event={selectedEventForEdit}
						isOpen={selectedEventForEdit !== null}
						onClose={handleCloseModal}
						onEditSuccess={handleEditSuccess}
					/>
				)}
			</div>
		);
	}
};

export default EventPage;
