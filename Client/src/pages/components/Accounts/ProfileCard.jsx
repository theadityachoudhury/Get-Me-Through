import React, { useContext, useState } from "react";

import { UserContext } from "../../../UserContext";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileCard = () => {
	const [isEditing, setIsEditing] = useState(false);
	const { user, setUser, ready } = useContext(UserContext);
	const [editedFields, setEditedFields] = useState({});

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = (e) => {
		e.preventDefault();

		if (Object.keys(editedFields).length === 0) {
			toast.success("No changes were made.", { icon: "🔒" });
		} else {
			// Make an API request to update only the changed fields
			axios	
				.post("/api/auth/update", editedFields)
				.then((response) => {
					toast("Profile updated successfully.", { icon: "🚀" });
				})
				.catch((error) => {
					toast.error("Failed to update profile.");
					console.error(error);
				});
		}
		setEditedFields({});
		setIsEditing(false);
	};

	const handleFieldChange = (fieldName, value) => {
		setEditedFields({ ...editedFields, [fieldName]: value });
		setUser({...user,[fieldName]:value})
    };

	if (user && ready)
		return (
			<div className="bg-white rounded-lg shadow-md p-4">
				<h1 className="text-2xl font-semibold mb-2">Profile</h1>
				<div className="mb-4">
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-4">Name:</span>
						<input
							type="text"
							value={user.name === null ? "" : user.name}
							onChange={(e) => handleFieldChange("name", e.target.value)}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled={!isEditing}
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-5">Email:</span>
						<input
							type="email"
							value={user.email}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-6">Role:</span>
						<input
							type="text"
							value={user.role}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-1">Username:</span>
						<input
							type="text"
							value={user.username}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-1">Verified:</span>
						<input
							type="text"
							value={String(user.verified).toUpperCase()}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-3">Phone:</span>
						<input
							type="text"
							value={user.mobile === null ? "" : user.mobile}
							onChange={(e) => handleFieldChange("mobile", e.target.value)}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled={!isEditing}
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-1">Address:</span>
						<input
							type="text"
							value={user.address === null ? "" : user.address}
							onChange={(e) => handleFieldChange("address", e.target.value)}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled={!isEditing}
						/>
					</div>
					<div className="flex justify-between items-center mb-4">
						<span className="text-gray-600 font-medium pr-1">Deleted:</span>
						<input
							type="text"
							value={String(user.deleted).toUpperCase()}
							className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							disabled
						/>
					</div>
					<p className="font-medium">Account Created At:- {user.createdAt}</p>
					<p className="font-medium">Last Updated At:- {user.updatedAt}</p>
				</div>
				{/* Add more label-data pairs as needed */}
				<div className="text-right">
					{isEditing ? (
						<button
							onClick={handleSaveClick}
							className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2">
							Save
						</button>
					) : (
						<button
							onClick={handleEditClick}
							className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2">
							Edit
						</button>
					)}
				</div>
			</div>
		);
};

export default ProfileCard;
