const nodemailer = require("nodemailer");
const { SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_HOST } = require("../../config/db");
const email_logs = require("../../models/email-logs");

const save_message = async (
	username,
	to,
	subject,
	body,
	status,
	type,
	messageId
) => {
	let log = new email_logs({
		username,
		to,
		subject,
		body,
		status,
		type,
		messageId,
	});
	await log.save();
};

const mailer = async (to, subject, hbody, username, type) => {
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: true, // true for 465, false for other ports
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
	});

	if (!Array.isArray(to)) {
		to = [to];
	}

	let message = {
		from: '"Aditya Choudhury" <aditya@adityachoudhury.com>', // sender address
		to: to.join(', '), // List of receivers, join the array into a comma-separated string
		subject: subject, // Subject line
		html: hbody, // html body
	};

	let info = await transporter.sendMail(message);
	for (const recipient of to) {
		save_message(username, recipient, subject, hbody, "success", type, info.messageId);
	}
	return;
};

module.exports = {
	mailer,
};
