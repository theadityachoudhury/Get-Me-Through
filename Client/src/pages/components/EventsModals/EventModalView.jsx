import React from "react";
import "./Modal.css";

const EventModalView = ({ event, onClose, isOpen }) => {
	console.log(
		new Intl.DateTimeFormat("en-US", {
			dateStyle: "short",
		}).format(new Date(event.date))
	);

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
	return (
		<div className={`modal ${isOpen ? "open" : ""}`}>
			<div className="overlay"></div>
			<div className="modal-content w-screen">
				<h2 className="text-center text-5xl font-bold m-5">Event Details</h2>

				<div
					className="modal-content-scrollable"
					style={{ maxHeight: "500px", overflowY: "scroll" }}>
					<form>
						{/* Title */}
						<div className="mb-4 flex items-center">
							<label htmlFor="title" className="text-lg font-semibold w-1/3">
								Title:
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={event.title}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Description */}
						<div className="mb-4 flex items-center">
							<label
								htmlFor="description"
								className="text-lg font-semibold w-1/3">
								Description:
							</label>
							<textarea
								id="description"
								name="description"
								value={event.description}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 h-32 text-sm"
							/>
						</div>

						{/* Date */}
						<div className="mb-4 flex items-center">
							<label htmlFor="date" className="text-lg font-semibold w-1/3">
								Date:
							</label>
							<input
								type="date"
								id="date"
								name="date"
								value={formatDate(event.date)}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Location */}
						<div className="mb-4 flex items-center">
							<label htmlFor="location" className="text-lg font-semibold w-1/3">
								Location:
							</label>
							<input
								type="text"
								id="location"
								name="location"
								value={event.location}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Organizer */}
						<div className="mb-4 flex items-center">
							<label
								htmlFor="organizer"
								className="text-lg font-semibold w-1/3">
								Organizer:
							</label>
							<input
								type="text"
								id="organizer"
								name="organizer"
								value={event.organizer}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Category */}
						<div className="mb-4 flex items-center">
							<label htmlFor="category" className="text-lg font-semibold w-1/3">
								Category:
							</label>
							<input
								type="text"
								id="category"
								name="category"
								value={event.category}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Registration Fee */}
						<div className="mb-4 flex items-center">
							<label
								htmlFor="registrationFee"
								className="text-lg font-semibold w-1/3">
								Registration Fee:
							</label>
							<input
								type="number"
								id="registrationFee"
								name="registrationFee"
								value={event.registrationFee}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Capacity */}
						<div className="mb-4 flex items-center">
							<label htmlFor="capacity" className="text-lg font-semibold w-1/3">
								Max Participation:
							</label>
							<input
								type="number"
								id="capacity"
								name="capacity"
								value={event.capacity}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Registration Deadline */}
						<div className="mb-4 flex items-center">
							<label
								htmlFor="registrationDeadline"
								className="text-lg font-semibold w-1/3">
								Registration Deadline:
							</label>
							<input
								type="date"
								id="registrationDeadline"
								name="registrationDeadline"
								value={formatDate(event.registrationDeadline)}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm"
							/>
						</div>

						{/* Status */}
						<div className="mb-4 flex items-center">
							<label htmlFor="status" className="text-lg font-semibold w-1/3">
								Event Status:
							</label>
							<select
								id="status"
								name="status"
								value={event.status}
								disabled
								className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm">
								<option value="upcoming">Upcoming</option>
								<option value="past">Past</option>
								<option value="canceled">Canceled</option>
							</select>
						</div>

						{/* Tags */}
						<div className="mb-4 flex items-center">
							<label htmlFor="tags" className="text-lg font-semibold w-1/3">
								Event Tags:
							</label>
							<div className="border border-gray-300 rounded px-3 py-2 w-2/3 text-sm">
								{event.tags.join(", ")}
							</div>
						</div>
					</form>
				</div>

				<button className="close-button mt-5" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default EventModalView;
