const nodemailer = require("nodemailer");

let transporter = null;

exports.init = function() {
    const config = {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
	    user: process.env.MAIL_USER,
	    pass: process.env.MAIL_PASS
	}
    };

    switch(process.env.SMTP_SECURE) {
    case "true":
	config.secure = true;
	break;
    case "false":
	config.secure = false;
	break;
    default:
	throw new Error("Invalid value for SMTP_SECURE");
	break;
    }

    transporter = nodemailer.createTransport(config);
    // TODO: test it, then resolve or reject accordingly
    return Promise.resolve();
}

exports.verify = async function({ username, email, token }) {
    if (!transporter) throw new Error("Mailer was not initialized");
    const url = `${process.env.ORIGIN}/verify?token=${token}`;

    const message = {
	from: `Polls App <${process.env.MAIL_USER}>`,
	to: `${username} <${email}>`,
	subject: "Polls App email confirmation",
	text: "Please visit this link to confirm your email: " + url,
	html: `Please visit <a href="${url}">this link</a> ` +
	    "to confirm your email"
    };

    const info = await transporter.sendMail(message);

    if (process.env.SMTP_HOST === "smtp.ethereal.email") {
	console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
}
