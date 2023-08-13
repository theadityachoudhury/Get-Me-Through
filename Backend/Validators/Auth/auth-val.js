const Joi = require("joi");
const User = require("../../Models/Auth/users");

const signupSchema = Joi.object({
	name: Joi.string().min(2).required(),
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_]{3,30}$"))
		.min(8)
		.required(),
});

const validateEmail = async (email) => {
	const user = User.findOne({ email: email });
	let response = User ? true : false;
	return response;
};

module.exports = {
	signupSchema,
	validateEmail,
};
