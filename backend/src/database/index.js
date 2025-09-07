const { MongoClient } = require('mongodb');

let client;
let db;

async function connectDB() {
	if (db) return db; // ✅ reuse cached db connection

	if (!client) {
		client = new MongoClient(process.env.MONGO_URI);
		await client.connect();
		console.log('✅ MongoDB connected:', process.env.DB_NAME || 'flipmart');
	}

	db = client.db(process.env.DB_NAME || 'flipmart');
	await db.collection('users').createIndex({ email: 1 }, { unique: true });
	await db.collection('carts').createIndex({ userId: 1 }, { unique: true });

	return db;
}

function getDb() {
	if (!db) {
		throw new Error('❌ Database not connected. Call connectDB first.');
	}
	return db;
}

module.exports = { connectDB, getDb };
