const { Schema, model } = require("mongoose");

const RefreshTokenSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: [String],
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("RefreshToken", RefreshTokenSchema);
