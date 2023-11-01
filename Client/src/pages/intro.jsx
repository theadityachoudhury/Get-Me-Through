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
						buttonData={"Manage Events"}
					/>
					<Card
						title={"Email Logs"}
						description={
							"Check all the emails sent for administrative purposes"
						}
						link={"/emails"}
						buttonData={"View Logs"}
					/>
					<Card
						title={"Manage Your Account"}
						description={"Update and view your profile here"}
						link={"/account"}
						buttonData={"Manage Account"}
					/>
					<Card
						title={"Registered Events"}
						description={"See all the events you have registered for!!"}
						link={"/account/bookings"}
						buttonData={"View"}
					/>
				</div>
				<div className="flex">
					<Card
						title={"Attended Events"}
						description={"See all the events you have attended!!"}
						link={"/account/places"}
						buttonData={"View"}
					/>

					<Card
						title={"Contact Logs"}
						description={"See all the Contact form submissions!!"}
						link={"/contact"}
						buttonData={"View Logs"}
					/>

					<Card
						title={"Manage Users"}
						description={
							"View and Manage all the users that are registered on this platform!!"
						}
						link={"/manage/users"}
						buttonData={"Manage Users"}
					/>

					{/* <Card title={"wgwejfk"} description={"fsgweg"} link={"s"} buttonData={"bb"} /> */}
				</div>
			</>
		);
	}
};

export default Intro;
