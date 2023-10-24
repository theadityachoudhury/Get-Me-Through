import React, { useState } from "react";
import "./Modal.css";
import axios from "axios";
import toast from "react-hot-toast";

const EventModalEdit = ({ event, onClose, isOpen, onEditSuccess }) => {
	const [formData, setFormData] = useState(event);

	const handleChange = (e, name) => {
		const { value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleDate = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleTagsChange = (e) => {
		// Add tags to the array when Enter key is pressed
		if (e.key === "Enter" && e.target.value.trim() !== "") {
			e.preventDefault();
			e.stopPropagation();
			if (formData.tags.length < 5) {
				setFormData({
					...formData,
					tags: [...formData.tags, e.target.value.trim()],
					tagsInput: "",
				});
				e.target.value = "";
			}
		}
	};

	const removeTag = (tagToRemove) => {
		setFormData({
			...formData,
			tags: formData.tags.filter((tag) => tag !== tagToRemove),
		});
	};

	const handleSaveChanges = (e) => {
		e.preventDefault();
		const updatedData = {};

		for (const key in formData) {
			if (formData[key] !== event[key]) {
				updatedData[key] = formData[key];
			}
		}

		if (Object.keys(updatedData).length === 0) {
			toast.error("No changes made.");
			return;
		}

		axios
			.put(`/api/events/update/${event._id}`, updatedData)
			.then((response) => {
				if (response.status === 200) {
					toast.success("Success: " + response.data.message);
					onEditSuccess({ ...event, ...updatedData });
				}
			})
			.catch((error) => {
				const errorData = error.response
					? error.response.data.message
					: "An unexpected error occurred!!";
				toast.error(errorData);
			});
	};

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
					<form onSubmit={handleSaveChanges}>
						{/* Title */}
						<div className="mb-4 flex items-center">
							<label htmlFor="title" className="text-lg font-semibold w-1/3">
								Title:
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={(e) => handleChange(e, "title")}
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
								value={formData.description}
								onChange={(e) => handleChange(e, "description")}
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
								value={formatDate(formData.date)}
								onChange={handleDate}
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
								value={formData.location}
								onChange={(e) => handleChange(e, "location")}
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
								value={formData.organizer}
								onChange={(e) => handleChange(e, "organizer")}
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
								value={formData.category}
								onChange={(e) => handleChange(e, "category")}
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
								value={formData.registrationFee}
								onChange={(e) => handleChange(e, "registrationFee")}
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
								value={formData.capacity}
								onChange={(e) => handleChange(e, "capacity")}
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
								value={formatDate(formData.registrationDeadline)}
								onChange={handleDate}
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
								value={formData.status}
								onChange={(e) => handleChange(e, "status")}
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
							{formData.tags.length < 5 ? (
								<input
									type="text"
									id="tags"
									name="tags"
									value={formData.tagsInput}
									onKeyPress={handleTagsChange}
									onChange={(e) =>
										setFormData({ ...formData, tagsInput: e.target.value })
									}
									className="border border-gray-300 rounded px-2 py-1"
									placeholder={`You can add ${5 - formData.tags.length} tags`}
								/>
							) : (
								<input
									type="text"
									id="tags"
									name="tags"
									value={formData.tagsInput}
									onKeyPress={handleTagsChange}
									onChange={(e) =>
										setFormData({ ...formData, tagsInput: e.target.value })
									}
									className="border border-gray-300 rounded px-2 py-1"
									placeholder="Upto 5 tags only. Remove to add more"
									disabled
								/>
							)}
						</div>
						<div className="flex flex-wrap mt-2">
							{formData.tags.map((tag) => (
								<div
									key={tag}
									className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 m-1 flex items-center">
									<span style={{ marginLeft: "15px" }} className="">
										{tag}
									</span>
									<button
										type="button"
										onClick={() => removeTag(tag)}
										className="text-red-600 text-sm" // Reduced font size for the cross button
									>
										&#10005;
									</button>
								</div>
							))}
						</div>

						<button className="save-button mt-5">Save Changes</button>
					</form>
				</div>

				<button className="close-button mt-5" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default EventModalEdit;
