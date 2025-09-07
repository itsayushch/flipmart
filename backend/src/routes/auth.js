const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

	const db = await getDb();
	const existing = await db.collection('users').findOne({ email });
	if (existing) return res.status(400).json({ message: 'Email already registered' });

	const hashed = await bcrypt.hash(password, 10);
	const result = await db
		.collection('users')
		.insertOne({ name, email, password: hashed, role: 'user', createdAt: new Date() });

	const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});

	res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const db = await getDb();
	const user = await db.collection('users').findOne({ email });
	if (!user) return res.status(400).json({ message: 'Invalid credentials' });

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

	const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
	res.json({ token });
});

module.exports = router;
