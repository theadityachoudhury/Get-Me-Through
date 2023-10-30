import React, { useContext } from "react";
import Card from "./components/card";
import { UserContext } from "../UserContext";

const Intro = () => {
	const { ready, user } = useContext(UserContext);
	if (user && ready) {
		return (
			<>
				<div className="flex">
					<Card
						title={"Events"}
						description={`View Manage / Add / Mark Attendance of all the Events Here`}
						link={"/events"}
					/>
					<Card
						title={"Email Logs"}
						description={
							"Check all the emails sent for administrative purposes"
						}
						link={"/emails"}
					/>
					<Card
						title={"Manage Your Account"}
						description={"Update and view your profile here"}
						link={"/account"}
					/>
					<Card
						title={"Registered Events"}
						description={"See all the events you have registered for!!"}
						link={"/account/bookings"}
					/>
				</div>
				<div className="flex">
					<Card
						title={"Attended Events"}
						description={"See all the events you have attended!!"}
						link={"/account/places"}
					/>

					<Card
						title={"Contact Logs"}
						description={"See all the Contact form submissions!!"}
						link={"/contact"}
					/>

					<Card
						title={"Manage Users"}
						description={"View and Manage all the users that are registered on this platform!!"}
						link={"/manage/users"}
					/>

					<Card
						title={""}
						description={""}
						link={""}
					/>
				</div>
			</>
		);
	}
};

export default Intro;
