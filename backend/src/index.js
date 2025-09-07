require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const { connectDB } = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error('❌ Failed to connect to DB', err);
		process.exit(1);
	});
