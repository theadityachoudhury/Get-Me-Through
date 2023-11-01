import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const NotFound404 = () => {
	return (
		<div id="notfound">
			<div class="notfound">
				<div class="notfound-404">
					<h1>404</h1>
					<h2>Page not found</h2>
				</div>
				<Link to={"/dashboard"}>Homepage</Link>
			</div>
		</div>
	);
};

export default NotFound404;
