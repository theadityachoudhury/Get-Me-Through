const email = require("../../models/email-logs");
const Contact = require("../../models/contact");
const { contactLogSchema } = require("../Validators/Contact/validators");
const { mailer } = require("../Mailer/mailer");

const emailLogs = async (req, res, next) => {
    const emails = await email.find().sort({ createdAt: -1 });
    if (!emails) {
        return res.status(200).json([]);
    }
    return res.status(200).json(emails);
};

const contactLogs = async (req, res, next) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    if (!contacts) {
        return res.status(200).json([]);
    }
    return res.status(200).json(contacts);
};

const contact = async (req, res, next) => {
    try {
        const contactRequest = await contactLogSchema.validateAsync(req.body);
        const contact = new Contact({
            ...contactRequest
        });
        await contact.save();
        mailer(["adityasubham03@gmail.com", contactRequest.email], `Contact Form Submission Successful`, `Our team will reach out to you within 24 hours of submission of the form <br><br> Form Data:- <br> Name:- ${contactRequest.name}<br> Email:- ${contactRequest.email}<br> Message:- ${contactRequest.message}`, contactRequest.username, "contact_form");
        return res.status(200).json();
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
}

module.exports = {
    emailLogs,
    contact,
    contactLogs
}