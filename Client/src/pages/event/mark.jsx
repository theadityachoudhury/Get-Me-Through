// src/EventAttendance.js
import React, { useState } from "react";

const EventAttendance = () => {
	const [users, setUsers] = useState([
		{ id: 1, name: "User 1", attended: false },
		{ id: 2, name: "User 2", attended: false },
		// Add more users here...
	]);

	const handleCheckboxChange = (userId) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, attended: !user.attended } : user
			)
		);
		console.log(users);
	};

	const handleSaveAttendance = () => {
		// Send the updated attendance data to the backend API
		const updatedUsers = users.filter((user) => user.attended);
		console.log(updatedUsers);
		// You can make an API call here to send the data to the server
		console.log("Updated Attendance Data:", updatedUsers);
	};

	return (
		<div className="container mx-auto mt-8">
			<h1 className="text-3xl font-semibold mb-4">Event Attendance</h1>
			<div className="space-y-4">
				{users.map((user) => (
					<div key={user.id} className="flex items-center">
						<input
							type="checkbox"
							checked={user.attended}
							onChange={() => handleCheckboxChange(user.id)}
							className="mr-2"
						/>
						<span>{user.name}</span>
					</div>
				))}
			</div>
			<button
				onClick={handleSaveAttendance}
				className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
				Save Attendance
			</button>
		</div>
	);
};

export default EventAttendance;
