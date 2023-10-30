const { Schema, model } = require("mongoose");

const authSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
        },
        auth_type: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        }
	},
	{ timestamps: true }
);

module.exports = model("Auth", authSchema);
