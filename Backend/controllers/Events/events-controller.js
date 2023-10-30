const events = require("../../models/events");
const applied = require("../../models/applied");
const user = require("../../models/Users");
const { eventSchema, eventUpdateSchema } = require("../Validators/Events/validators");
const { admin } = require("../../config/firebase");

const addEvents = async (req, res, next) => {
    try {
        const eventAddRequest = await eventSchema.validateAsync(req.body);
        const Event = new events({
            ...eventAddRequest
        });
        await Event.save();

        return res.status(201).json({
            success: true,
            message: "Event added successfully"
        })
    } catch (e) {
        let errorMsg = "Unexpected Error Occurred!";
        if (e.isJoi === true) {
            e.status = 403;
            errorMsg = e.message;
        }
        return res.status(e.status || 500).json({
            reason: "server",
            message: errorMsg,
            success: false,
        });
    }
};

const getEvents = async (req, res, next) => {
    try {
        const event = await events.find().select('title description organizer date capacity applied').sort({ createdAt: -1 });
        if (!event) {
            return res.status(200).json([]);
        } else {
            return res.status(200).json(event);
        }
    } catch (e) {
        return res.status(500).json({
            reason: "server",
            message: "Unexpected Error Occurred!",
            success: false,
        })
    }
};

const getEvent = async (req, res, next) => {
    const { id } = req.params;
    try {
        const event = await events.findById(id);
        if (event) {
            return res.status(200).json(event);
        } else {
            return res.status(400).json();
        }
    } catch (e) {
        return res.status(400).json();
    }
};

const deleteEvent = async (req, res, next) => {
    const eventId = req.params.id;
    try {
        const event = await events.findByIdAndDelete(eventId);
        return res.status(200).json();

    } catch (e) {
        return res.status(404).json();
    }
};

const updateEvent = async (req, res, next) => {
    const { eventId } = req.params;
    if (!eventId) {
        return res.status(404).json();
    }

    try {
        const eventUpdateRequest = await eventUpdateSchema.validateAsync(req.body);
        const event = await events.findById(eventId);
        event.title = eventUpdateRequest.title || event.title;
        event.description = eventUpdateRequest.description || event.description;
        event.date = eventUpdateRequest.date || event.date;
        event.location = eventUpdateRequest.location || event.location;
        event.organizer = eventUpdateRequest.organizer || event.organizer;
        event.category = eventUpdateRequest.category || event.category;
        event.registrationFee = eventUpdateRequest.registrationFee || event.registrationFee;
        event.capacity = eventUpdateRequest.capacity || event.capacity;
        event.registrationDeadline = eventUpdateRequest.registrationDeadline || event.registrationDeadline;
        event.status = eventUpdateRequest.status || event.status;
        event.tags = eventUpdateRequest.tags || event.tags;
        await event.save();
        return res.status(200).json();
    } catch (e) {
        console.log(e);
        return res.status(400).json();

    }
}


const isApplied = async (req, res, next) => {
    const { id } = req.params;
    try {
        const apply = await applied.findOne({ user: req._id, event: id });
        if (apply) {
            return res.status(200).json();
        } else {
            return res.status(404).json();
        }
    } catch (e) {
        return res.status(400).json();
    }
};

const apply = async (req, res, next) => {
    const { id } = req.params;
    try {
        const isApplied = await applied.findOne({ user: req._id, event: id });
        if (isApplied) {
            return res.status(404).json("Already Applied!!");
        }

        let event = await events.findById(id).select("applied capacity");
        if (event.applied >= event.capacity) {
            return res.status(400).json({ success: false, message: "No more room for registrations!!" });
        }

        const userApply = new applied({
            user: req._id,
            event: id
        });
        await userApply.save();

        event = await events.findByIdAndUpdate(
            { _id: id },
            { $inc: { applied: 1 } });


        try {
            const firebaseRef = admin.database().ref('Students'); // Replace with your desired Firebase path

            // Push the data to Firebase
            await firebaseRef.push({
                user: req._id,
                event: id
            });

            res.status(201).json({ message: "Data saved to Firebase" });
        } catch (error) {
            res.status(500).json({ message: "Failed to save data to Firebase" });
        }

        return res.status(201).json();
    } catch (e) {
        console.log(e);
        return res.status(400).json();
    }
};


const markAttendance = async (req, res, next) => {
    const { eventId, userId } = req.params;
    if (!eventId || !userId) {
        return res.status(404).json({ success: false, message: "Data incomplete", reason: "no-data" });
    }
    const attendee = await applied.findOne({ user: userId, event: eventId });
    if (!attendee) {
        return res.status(404).json({
            success: false,
            message: "No user registered for this event!!",
            reason: "no-user"
        });
    }

    attendee.attended = true;
    await attendee.save();
    return res.status(200).json({
        success: true,
        message: "Attendance Successful"
    });
}

const registeredUsers = async (req, res, next) => {
    const { eventId } = req.params;
    try {
        const regs = await applied.find({ event: eventId });
        const userIds = regs.map((reg) => reg.user);
        const regUsers = await user.find({ _id: { $in: userIds } }).select("username email");
        if (!regUsers) {
            return res.status(200).json([]);
        } else {
            return res.status(200).json(regUsers);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            reason: "server",
            message: "Unexpected Error Occurred!",
            success: false,
            data: err,
        });
    }

}

const userRegisteredEvents = async (req, res, next) => {
    try {
        const applications = await applied.find({ user: req._id });
        const eventIds = applications.map((application) => application.event);
        const registeredEvents = await events.find({ _id: { $in: eventIds } }).select("title description organizer date capacity");
        if (!registeredEvents) {
            return res.status(200).json([]);
        } else {
            return res.status(200).json(registeredEvents);
        }
    } catch (err) {
        return res.status(500).json({
            reason: "server",
            message: "Unexpected Error Occurred!",
            success: false,
        });
    }
}
const userAttendedEvents = async (req, res, next) => {
    try {
        const applications = await applied.find({ user: req._id, attended: true });
        const eventIds = applications.map((application) => application.event);
        const registeredEvents = await events.find({ _id: { $in: eventIds } }).select("title description organizer date capacity");
        if (!registeredEvents) {
            return res.status(200).json([]);
        } else {
            return res.status(200).json(registeredEvents);
        }
    } catch (err) {
        return res.status(500).json({
            reason: "server",
            message: "Unexpected Error Occurred!",
            success: false,
        })
    }
}


module.exports = {
    addEvents,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    isApplied,
    apply,
    markAttendance,
    userRegisteredEvents,
    userAttendedEvents,
    registeredUsers,
}