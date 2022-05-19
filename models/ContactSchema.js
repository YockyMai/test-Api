const { Schema, model } = require('mongoose');

const ContactSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Contact = model('Contact', ContactSchema);

module.exports = Contact;
