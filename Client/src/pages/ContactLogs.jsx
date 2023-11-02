import React, { useState, useEffect } from "react";
import axios from "axios"; // You need to install axios if not already installed.
import Loader from "./components/Loader";
import toast from "react-hot-toast";

const ContactLogs = () => {
	const [contactData, setContactData] = useState([]);
	const [loading, isLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/api/email/contact")
			.then((response) => {
				setContactData(response.data);
			})
			.catch((error) => {
				toast.error("Error fetching data:", error);
			});
		isLoading(false);
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Contact Logs</h1>
			<table className="table-auto w-full">
				<thead>
					<tr>
						<th className="px-4 py-2">Name</th>
						<th className="px-4 py-2">Email</th>
						<th className="px-4 py-2">Message</th>
						<th className="px-4 py-2">Created At</th>
					</tr>
				</thead>
				<tbody>
					{contactData.map((contact) => (
						<tr key={contact._id}>
							<td className="border px-4 py-2">{contact.name}</td>
							<td className="border px-4 py-2">{contact.email}</td>
							<td className="border px-4 py-2">{contact.message}</td>
							<td className="border px-4 py-2">{contact.createdAt}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ContactLogs;
