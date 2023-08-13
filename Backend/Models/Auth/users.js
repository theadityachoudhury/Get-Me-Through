const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			required: true,
			default: false,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("Users", UserSchema);
