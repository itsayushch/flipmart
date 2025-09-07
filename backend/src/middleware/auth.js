const jwt = require('jsonwebtoken');
const { connectDB } = require('../database');
const { ObjectId } = require('mongodb');

async function auth(req, res, next) {
	const header = req.header('Authorization');
	if (!header || !header.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided' });
	}

	const token = header.split(' ')[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		const db = await connectDB();
		const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(payload.id) }, { projection: { password: 0 } });

		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = user;
		next();
	} catch (err) {
		console.error('Auth error:', err);
		return res.status(401).json({ message: 'Invalid token' });
	}
}

module.exports = auth;
