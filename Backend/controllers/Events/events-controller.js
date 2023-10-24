const events = require("../../models/events");
const { eventSchema, eventUpdateSchema } = require("../Validators/Events/validators");

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
        return res.status(400).json();

    }
}

module.exports = {
    addEvents,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent
}