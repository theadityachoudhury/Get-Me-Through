import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EventAddForm = () => {
	const { ready, user } = useContext(UserContext);
	const initialFormData = {
		title: "",
		description: "",
		date: formatDateToDDMMYYYY(new Date()),
		location: "",
		organizer: "",
		category: "",
		registrationFee: 0,
		capacity: 100,
		registrationDeadline: formatDateToDDMMYYYY(new Date()),
		status: "upcoming",
		tags: [],
		tagsInput: "",
	};
	const resetFormData = () => {
		setFormData(initialFormData);
	};

	// Define initial formData with the required fields as per the schema
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: formatDateToDDMMYYYY(new Date()),
		location: "",
		organizer: "",
		category: "",
		registrationFee: 0,
		capacity: 100,
		registrationDeadline: formatDateToDDMMYYYY(new Date()),
		status: "upcoming",
		tags: [],
		tagsInput: "", // Added tagsInput state
	});

	function formatDateToDDMMYYYY(date) {
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString();
		return `${year}-${month}-${day}`;
	}

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("clicked");
		// Handle form submission
		// You can add your registration logic here
		const eventData = {
			title: formData.title,
			description: formData.description,
			date: formData.date,
			location: formData.location,
			organizer: formData.organizer,
			category: formData.category,
			registrationFee: formData.registrationFee,
			capacity: formData.capacity,
			registrationDeadline: formData.registrationDeadline,
			status: formData.status,
			tags: formData.tags,
		};

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/api/events/add",
			headers: {
				"Content-Type": "application/json",
			},
			data: eventData,
		};

		try {
			const response = await axios.request(config);
			toast.success("Success: " + response.data.message);
			resetFormData();
		} catch (error) {
			console.error(error);
			const errorData = error.response
				? error.response.data.message
				: "An unexpected error occurred!!";
			toast.error(errorData);
		}
	};

	if (ready) {
		if (user && user.role === "admin") {
			return (
				<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
					<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
						<h2 className="text-2xl font-bold mb-4 text-center">
							Events Registration
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label htmlFor="title" className="block">
									Event Name:
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={(e) => handleChange(e, "title")}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="description" className="block mb-2">
									Event Description:
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={(e) => handleChange(e, "description")}
									className="border border-gray-300 rounded px-2 py-1"
									rows={3}
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="location" className="block">
									Location:
								</label>
								<input
									type="text"
									id="location"
									name="location"
									value={formData.location}
									onChange={(e) => handleChange(e, "location")}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="organizer" className="block">
									Event Host:
								</label>
								<input
									type="text"
									id="organizer"
									name="organizer"
									value={formData.organizer}
									onChange={(e) => handleChange(e, "organizer")}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="date" className="block">
									Event Date:
								</label>
								<input
									type="date"
									id="date"
									name="date"
									value={formData.date}
									onChange={handleDate}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="category" className="block">
									Category:
								</label>
								<input
									type="text"
									id="category"
									name="category"
									value={formData.category}
									onChange={(e) => handleChange(e, "category")}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="registrationFee" className="block">
									Registration Fee:
								</label>
								<input
									type="number"
									id="registrationFee"
									name="registrationFee"
									value={formData.registrationFee}
									onChange={(e) => handleChange(e, "registrationFee")}
									className="border border-gray-300 rounded px-2 py-1"
									disabled
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="capacity" className="block">
									Max Participation:
								</label>
								<input
									type="number"
									id="capacity"
									name="capacity"
									value={formData.capacity}
									onChange={(e) => handleChange(e, "capacity")}
									className="border border-gray-300 rounded px-2 py-1"
									min={100}
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="registrationDeadline" className="block">
									Registration Deadline:
								</label>
								<input
									type="date"
									id="registrationDeadline"
									name="registrationDeadline"
									value={formData.registrationDeadline}
									onChange={handleDate}
									className="border border-gray-300 rounded px-2 py-1"
									required
								/>
							</div>

							<div className="mb-4">
								<label htmlFor="status" className="block">
									Event Status:
								</label>
								<select
									id="status"
									name="status"
									value={formData.status}
									onChange={(e) => handleChange(e, "status")}
									className="border border-gray-300 rounded px-2 py-1">
									<option value="upcoming">Upcoming</option>
									<option value="past">Past</option>
									<option value="canceled">Canceled</option>
								</select>
							</div>

							<div className="mb-4">
								<label htmlFor="tags" className="block mb-2">
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
							</div>

							<button
								className="bg-green-500 text-white px-4 py-2 rounded">
								Register
							</button>
						</form>
					</div>
				</div>
			);
		} else {
			return <Navigate to={"/events"} />;
		}
	}
};

export default EventAddForm;
