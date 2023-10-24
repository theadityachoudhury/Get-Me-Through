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

const eventUpdateSchema = Joi.object({
    title: Joi.string().required().optional().default(null),
    description: Joi.string().optional().default(null),
    date: Joi.date().optional().default(null),
    location: Joi.string().optional().default(null),
    organizer: Joi.string().optional().default(null),
    category: Joi.string().optional().default(null),
    registrationFee: Joi.number().optional().default(null),
    capacity: Joi.number().required().optional().default(null),
    registrationDeadline: Joi.date().optional().default(null),
    status: Joi.string().valid('upcoming', 'past', 'canceled').optional().default(null),
    tags: Joi.array().items(Joi.string()).optional().default(null),
});

module.exports = {
    eventSchema,
    eventUpdateSchema,
};