import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Link } from "react-router-dom";

const EventAddForm = () => {
    const [formData, setFormData] = useState({
        "eventName": "",
        "eventDescription": "",
        "eventHost": "",
        "eventDate": "2023-04-01",
        "maxParticipation": 100
    });


    function formatDateToDDMMYYYY(date) {
        const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (adding 1 as it's zero-based) and pad with leading zero if needed
        const year = date.getFullYear().toString(); // Get full year
        return `${year}-${month}-${day}`;
      }

    const handleChange = (e,name) => {
        const { value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    
    const handleDate = (e) => {
        console.log(e.target.value);
        setFormData({
            ...formData,
            "eventDate": formatDateToDDMMYYYY(new Date(e.target.value))
        })
    }


	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("clicked");
		// Handle form submission
		// You can add your registration logic here
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Events Registration
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="eventName" className="block">
							Event Name:
						</label>
						<input
							type="text"
							id="eventName"
							value={formData["eventName"]}
							onChange={(e) => handleChange(e,"eventName")}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="eventDescription" className="block mb-2">
							Event Description:
						</label>
						<textarea
							type="text"
							id="eventDescription"
							value={formData["eventDescription"]}
							onChange={(e) => handleChange(e,"eventDescription")}
                            className="border border-gray-300 rounded px-2 py-1"
                            rows={10}
							required
						/>
                    </div>
                    
                    <div className="mb-4">
						<label htmlFor="eventName" className="block">
							Event Host:
						</label>
						<input
							type="text"
							id="eventName"
							value={formData["eventHost"]}
							onChange={(e) => handleChange(e,"eventHost")}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>
                    </div>
                    
                    <div className="mb-4">
						<label htmlFor="eventDate" className="block">
							Event Date:
						</label>
						<input
							type="date"
							id="eventDate"
							value={formData["eventDate"]}
							onChange={handleDate}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>
                    </div>
                    
                    <div className="mb-4">
						<label htmlFor="maxParticipation" className="block">
							Max Participation:
						</label>
						<input
							type="number"
							id="maxParticipation"
							value={formData["maxParticipation"]}
							onChange={(e) => handleChange(e,"maxParticipation")}
                            className="border border-gray-300 rounded px-2 py-1"
                            min={100}
							required
						/>
					</div>

				
					<button
						type="submit"
						className="bg-green-500 text-white px-4 py-2 rounded">
						Register
					</button>
					
                </form>
                <p className="mt-3 text-center text-red">Don't have an account yet? <Link to="/register">Register Here</Link></p>
			</div>
		</div>
	);
};

export default EventAddForm;
