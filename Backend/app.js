const express = require("express");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { initializeFirebase } = require("./config/firebase");

const { DB, REQUEST_TIMEOUT, PORT } = require("./config/db");
const auth = require("./routes/auth-routes");
const event = require("./routes/events-routes");
const email = require("./routes/email-routes");
const User = require("./models/Users");

const app = express();

//Configurations
app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//App routes starts here
app.get("/", async (req, res) => {
    res.send({
        data: {
            appName: "Get-Me-Through",
            developedBy: "Aditya Choudhury || Adwaith PJ",
            maintainedBy: "Aditya Choudhury || Adwaith PJ",
            version: "1.0.0.5",
        },
        success: true,
    })
});

app.get("/api/health", (req, res) => {
    res.send({
        message: "Server is Up and running",
        success: true,
    });
});

app.use("/api/auth", auth);
app.use("/api/events", event);
app.use("/api/email", email);

app.get("/update-users", async (req, res) => {
    try {
        const updateQuery = {
            $set: {
                name: null, // Set default value for 'name' to null
                mobile: null, // Set default value for 'mobile' to null
                address: null, // Set default value for 'address' to null
            },
        };

        const result = await User.updateMany({}, updateQuery);

        res.json({ message: "Updated successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Error updating users", details: error.message });
    }
});



app.use((req, res) => {
    res.status(404).json({
        reason: "invalid-request",
        message:
            "The endpoint you wanna reach is not available! Please check the endpoint again",
        success: false,
    });
});


//Connecting tp the DB
const startApp = async () => {
    try {
        // Connection With DB
        await connect(DB + "/getmethrough", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: REQUEST_TIMEOUT,
            writeConcern: { w: 'majority' },
        });

        initializeFirebase();

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