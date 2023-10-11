import React, { useState, useEffect } from "react";
import axios from "axios"; // You may need to install axios if not already installed

const EventPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("API_URL_HERE")
      .then((response) => {
          const eventData = response.data;
          setEvents(eventData);
        //   console.log(events);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });

      const eventData = [
        {
          "eventName": "Event 1",
          "eventDescription": "Description for Event 1",
          "eventHost": "Host 1",
          "eventDate": "2023-04-01",
          "maxParticipation": 100
        },
        {
          "eventName": "Event 2",
          "eventDescription": "Description for Event 2",
          "eventHost": "Host 2",
          "eventDate": "2023-04-15",
          "maxParticipation": 150
        },  
      ]
      
      setEvents(eventData);
    //   console.log(events);
  }, []);

  return (
    <div className="event-page p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
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
                {event.eventName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.eventDescription}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.eventHost}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.eventDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.maxParticipation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="mr-2 text-black hover:underline p-1 w-16 h-8 bg-blue-200 hover:bg-blue-300">View</button>
                <button className="mr-2 text-black hover:underline p-1 w-16 h-8 bg-green-200 hover:bg-green-300">Edit</button>
                <button className="text-black hover:underline p-1 w-16 h-8 bg-red-200 hover:bg-red-300">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventPage;
