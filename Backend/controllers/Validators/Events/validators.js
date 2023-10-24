const Joi = require("joi");
const User = require("../../../models/Users");

const eventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    organizer: Joi.string().required(),
    category: Joi.string().required(),
    registrationFee: Joi.number().default(0),
    capacity: Joi.number().required().min(100).default(100),
    registrationDeadline: Joi.date().required(),
    status: Joi.string().valid('upcoming', 'past', 'canceled').default('upcoming'),
    tags: Joi.array().items(Joi.string()),
});

module.exports = { eventSchema };