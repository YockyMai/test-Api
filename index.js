const express = require('express');
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/cors.middleware');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const Contact = require('./models/ContactSchema');

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.post('/contacts', async (req, res) => {
	try {
		const { name, phone } = req.body;
		if (name.length > 0 && phone.length > 6) {
			const contact = new Contact({
				name,
				phone,
			});

			await contact.save((err, contact) => {
				if (err)
					return res.status(400).json({
						message: err,
					});
				return res.json({
					message: 'ok',
					contact,
				});
			});
		} else {
			return res.status(400).json({
				message: 'validation failed',
			});
		}
	} catch (e) {
		console.log(e);
	}
});

app.get('/contacts', async (req, res) => {
	const contacts = await Contact.find({});

	return res.json({
		contacts,
	});
});

app.delete('/contacts/:id', (req, res) => {
	const id = req.params.id;
	Contact.findByIdAndDelete(id, (err, deletedContact) => {
		if (err) {
			return res.status(400).json({
				message: 'contact not found',
			});
		}
		return res.json({
			message: 'ok',
			deletedContact,
		});
	});
});

app.post('/contacts/refactor/', (req, res) => {
	const { _id, name, phone } = req.body;

	Contact.findOneAndUpdate(
		{ _id: _id },
		{ $set: { name: name, phone: phone } },
		{ new: true },
		(err, contact) => {
			if (err) {
				return res.status(400).json({
					message: 'contact not found',
				});
			}
			return res.json({
				message: 'ok',
				contact,
			});
		},
	);
});

const start = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://ValeriyGrigorev:Dfkthf15102003@cluster0.1tyia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
		);
		app.listen(PORT, () => {
			console.log(`Server runned on ${PORT} port`);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
