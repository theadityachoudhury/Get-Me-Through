const { Schema, model } = require("mongoose");

const contactLogSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
        },
        message: {
            type: String,
            required: true,
        },
	},
	{ timestamps: true }
);

module.exports = model("contactLog", contactLogSchema);
