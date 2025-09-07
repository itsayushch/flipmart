const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		name: 'Flipmart API',
		version: '1.0.0',
		status: 'running',
		uptime: process.uptime(),
		timestamp: new Date(),
	});
});

module.exports = router;
