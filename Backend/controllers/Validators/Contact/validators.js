const Joi = require("joi");
const User = require("../../../models/Users");

const contactLogSchema = Joi.object({
    username: Joi.string().required(),  
    name: Joi.string().required(),
    email: Joi.string().required(),
    message: Joi.string().required(),
});

module.exports = {
    contactLogSchema
};