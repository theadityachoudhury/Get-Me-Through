import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import EventModalView from "../EventsModals/EventModalView";

const Places = () => {
	// const { ready, user } = useContext(UserContext);
	const [events, setEvents] = useState([]);
	const [selectedEventForView, setSelectedEventForView] = useState(null);

	const handleViewClick = async (event) => {
		const { data } = await axios.get(`/api/events/${event._id}`);
		setSelectedEventForView(data);
	};

	const handleCloseModal = () => {
		setSelectedEventForView(null);
		setSelectedEventForEdit(null);
	};

	useEffect(() => {
		axios
			.post("/api/events/attended")
			.then((response) => {
				const eventData = response.data;
				setEvents(eventData);
			})
			.catch((error) => {
				console.error("Error fetching event data:", error);
			});
	}, []);

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

	return (
		<div>
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
		</div>
	);
};

export default Places;
