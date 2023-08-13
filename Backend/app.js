const express = require("express");
const { set, connect } = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { success, error } = require("consola");
const { DB, REQUEST_TIMEOUT, PORT } = require("./config/db");

//Routes Imports
const auth = require("./Routes/Auth/auth-routes");


const app = express();


//CORS Definition
app.use(
	cors({
		credentials: true,
		origin: ['https://f.adityachoudhury.com','http://localhost:5173'],
	})
);

//For getting req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Api Endpoints
app.get("/", async (req, res) => {
	res.send({
		data: {
			appName: "Fuzzy Spork Backend",
			developedBy: "Aditya Choudhury, Adwaith PJ",
			maintainedBy: "Unknown Club",
			version: "1.0.0",
		},
		success: true,
	});
});

app.post("/", (req, res, next) => {
	res.send({
		message: "POST request is not allowed in this endpoint!!",
		success: false,
	});
});

app.get("/api/health", (req, res) => {
	res.send({
		message: "Server is Up and running",
		success: true,
	});
});

//Authentication Endpoints
app.use("/api/auth",auth);


app.use((req, res) => {
	res.status(404).json({
		reason: "invalid-request",
		message:
			"The endpoint you wanna reach is not available! Please check the endpoint again",
		success: false,
	});
});



//Database configuration and connection
const startApp = async () => {
	try {
		// Connection With DB
		await connect(DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: REQUEST_TIMEOUT,
		});

		success({
			message: `Successfully connected with the Database \n${DB}`,
			badge: true,
		});

		// Start Listenting for the server on PORT
		app.listen(PORT, async () => {
			success({ message: `Server started on PORT ${PORT}`, badge: true });
		});
	} catch (err) {
		error({
			message: `Unable to connect with Database \n${err}`,
			badge: true,
		});
		startApp();
	}
};

startApp();