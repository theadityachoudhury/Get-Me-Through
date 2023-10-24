const events = require("../../models/events");
const { eventSchema } = require("../Validators/Events/validators");

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
        const event = await events.find().select('title description organizer date capacity').sort({ createdAt: -1 });;
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
            return res.status(400);
        }
    } catch (e) {
        return res.status(400);
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
    
}

module.exports = {
    addEvents,
    getEvents,
    getEvent,
    updateEvent
}