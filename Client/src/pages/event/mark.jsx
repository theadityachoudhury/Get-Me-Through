import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EventAttendance = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { eventId } = useParams();

	useEffect(() => {
		// Simulate fetching data from the API
		axios
			.get(`/api/events/regApplicants/${eventId}`)
			.then((response) => {
				setUsers(response.data);
				setLoading(false);
			})
			.catch((error) => {
				toast.error("Error fetching attendance data:", error);
				setLoading(false);
			});
	}, [eventId]);

	const handleCheckboxChange = (userId) => {
		// Update the local state
		const updatedUsers = users.map((user) =>
			user.user._id === userId
				? { ...user, attended: !user.attended } // Invert the value here
				: user
		);
		setUsers(updatedUsers);
	};
	// console.log(users);

	const handleSaveAttendance = () => {
		// Send all user data to the backend
		axios
			.post(`/api/events/mark/${eventId}`, users)
			.then((response) => {
				toast.success("Attendance data updated successfully:");
			})
			.catch((error) => {
				toast.error("Error updating attendance data!!");
			});
	};

	return (
		<div className="container mx-auto mt-8">
			<h1 className="text-3xl font-semibold mb-4">Event Attendance</h1>
			{loading ? (
				<p>Loading attendance data...</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full border rounded-lg">
						<thead>
							<tr className="bg-gray-200">
								<th className="border p-2">Username</th>
								<th className="border p-2">Attended</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id} className="text-center">
									<td className="border p-2">{user.user.username}</td>
									<td className="border p-2">
										<input
											type="checkbox"
											checked={user.attended}
											onChange={() => handleCheckboxChange(user.user._id)}
											className="mx-auto h-6 w-6 rounded-full text-blue-500 border border-blue-500 shadow"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<button
				onClick={handleSaveAttendance}
				className="mt-4 bg-blue-500 hover-bg-blue-600 text-white font-semibold py-2 px-4 rounded">
				Save Attendance
			</button>
		</div>
	);
};

export default EventAttendance;
