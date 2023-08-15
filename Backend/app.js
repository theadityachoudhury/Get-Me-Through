const express = require("express");
const { set, connect, model, Schema } = require("mongoose");
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

//Registrations MongoDB Schema
const registrationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name Required'],
        minlength: [2, 'Name should have at least 2 characters'],
        maxlength: [30, 'Name should have at most 30 characters']
    },
    rollNumber: {
        type: String,
        required: [true, 'Roll Number Required'],
        minlength: [6, 'Roll Number should have at least 6 characters'],
        maxlength: [9, 'Roll Number should have at most 9 characters']
    },
    currentYear: {
        type: String,
        required: [true, 'Current Year Required'],
        validate: {
            validator: (value) => value.length === 1,
            message: 'Current Year should have exactly 1 character'
        }
    },
    branch: {
        type: String,
        required: [true, 'Branch Required'],
        minlength: [1, 'Branch should have at least 1 character'],
        maxlength: [25, 'Branch should have at most 25 characters'],
        validate: {
            validator: (value) => /^(?=.*[A-Za-z])/.test(value),
            message: 'Branch should contain at least one alphabet'
        }
    },
    kiitEmailId: {
        type: String,
        required: [true, 'KIIT Email Required'],
        validate: {
            validator: (value) => /^[A-Z0-9._%+-]+@kiit\.ac\.in$/i.test(value),
            message: 'KIIT Email should be a valid KIIT email address'
        }
    },
    personalEmailId: {
        type: String,
        required: [true, 'Personal Email Required'],
        validate: {
            validator: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
            message: 'Personal Email should be a valid email address'
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number Required'],
        minlength: [10, 'Phone Number should have at least 10 digits'],
        maxlength: [15, 'Phone Number should have at most 15 digits'],
        validate: {
            validator: (value) => /^\d+$/.test(value),
            message: 'Phone Number should contain only digits'
        }
    },
    interestedField: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
        default: "None Given",
    },
    github: {
        type: String,
        required: [true, 'Github Required'],
        minlength: [2, 'Github should have at least 2 characters'],
        maxlength: [100, 'Github should have at most 100 characters']
    },
    expectation: {
        type: String,
        default: "None Given",
    },
    ip: {
        type: String,
    },
    host: {
        type: String,
    },
    userAgent: {
        type: String,
    }
}, { timestamps: true });

const reg = model('registration', registrationSchema);


//API Endpoints for registrations
app.post("/api/register", async (req, res) => {
    try {
        const { name, rollNumber, currentYear, branch, kiitEmailId, personalEmailId, phoneNumber, interestedField, linkedin, github, expectation } = req.body;
        const ip = req.ip;
        const host = req.get('host');
        const userAgent = req.get('user-agent');
        const existingRegistrations = await reg.findOne({ kiitEmailId: kiitEmailId });
        if (existingRegistrations) {
            return res.status(409).json({ message: "User already registered" });
        }
        
        const registration = new reg({
            name, rollNumber, currentYear, branch, kiitEmailId, personalEmailId, phoneNumber, interestedField, linkedin, github, expectation,
            ip,
            host,
            userAgent,
        });
        await registration.save();
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        let errorMsg = "Invalid Data";

        return res.status(err.status || 400).json({ message: errorMsg });
    }

})


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
