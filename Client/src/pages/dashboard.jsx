import React, { useContext } from "react";
import Card from "./components/card";
import { UserContext } from "./UserContext.jsx";

const Dashboard = () => {
	const { ready, user } = useContext(UserContext);
	if (user && ready) {
		return (
			<>
				<Card title={"Events"} description={"See all the events here"} />
			</>
		);
	}
};

export default Dashboard;
