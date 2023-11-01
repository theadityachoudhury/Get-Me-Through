import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../UserContext";
import Loader from "../components/Loader";

const EventAttendance = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { ready, user } = useContext(UserContext);
	const { eventId } = useParams();

	useEffect(() => {
		async function fetchAttendanceData() {
			try {
				const response = await axios.get(
					`/api/events/regApplicants/${eventId}`
				);
				setUsers(response.data);
				setLoading(false);
			} catch (error) {
				toast.error("Error fetching attendance data:", error);
				setLoading(false);
			}
		}

		fetchAttendanceData();
	}, [eventId]);

	const handleCheckboxChange = (userId) => {
		const updatedUsers = users.map((user) =>
			user.user._id === userId ? { ...user, attended: !user.attended } : user
		);
		setUsers(updatedUsers);
	};

	const handleSaveAttendance = async () => {
		try {
			await axios.post(`/api/events/mark/${eventId}`, { users });
			toast.success("Attendance data updated successfully");
		} catch (error) {
			toast.error("Error updating attendance data:", error);
		}
	};
	if (loading) {
		return <Loader />;
	}

	if (ready)
		if (user && user.role === "admin") {
			return (
				<div className="container mx-auto mt-8">
					<h1 className="text-3xl font-semibold mb-4">Event Attendance</h1>

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

					<button
						onClick={handleSaveAttendance}
						className="mt-4 bg-blue-500 hover-bg-blue-600 text-white font-semibold py-2 px-4 rounded">
						Save Attendance
					</button>
				</div>
			);
		} else {
			return <Navigate to={"/dashboard"} />;
		}
};

export default EventAttendance;
