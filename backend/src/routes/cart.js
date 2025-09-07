const express = require('express');
const { getDb } = require('../database');
const authMiddleware = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// ✅ Get user cart
router.get('/', authMiddleware, async (req, res) => {
	try {
		const db = await getDb();
		const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(req.body.user.id) }, { projection: { cart: 1 } });

		res.json({ items: user?.cart || [] });
	} catch (err) {
		console.error('Error fetching cart:', err);
		res.status(500).json({ error: 'Failed to fetch cart' });
	}
});

// ✅ Add item to cart
router.post('/', authMiddleware, async (req, res) => {
	const { productId, quantity } = req.body;



	if (!productId || !quantity) {
		return res.status(400).json({ error: 'productId and quantity required' });
	}

	try {
		const db = await getDb();
		const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(req.body.user.id) });

		let cart = user?.cart || [];
		const existing = cart.find((item) => item.id === productId);

		if (existing) {
			existing.quantity += quantity;
		} else {
			cart.push({ id: productId, quantity });
		}

		await db.collection('users').updateOne({ _id: ObjectId.createFromHexString(req.body.user.id) }, { $set: { cart } }, { upsert: true });

		res.json({ items: cart });
	} catch (err) {
		console.error('Error adding to cart:', err);
		res.status(500).json({ error: 'Failed to add to cart' });
	}
});

// ✅ Update item quantity
router.put('/:id', authMiddleware, async (req, res) => {
	const productId = req.params.id;
	const { quantity } = req.body;

	if (!quantity || quantity < 1) {
		return res.status(400).json({ error: 'Quantity must be >= 1' });
	}

	try {
		const db = await getDb();
		const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(req.body.user.id) });

		let cart = user?.cart || [];
		const existing = cart.find((item) => item.id === productId);

		if (existing) {
			existing.quantity = quantity;
		} else {
			cart.push({ id: productId, quantity });
		}

		await db.collection('users').updateOne({ _id: ObjectId.createFromHexString(req.body.user.id) }, { $set: { cart } });

		res.json({ items: cart });
	} catch (err) {
		console.error('Error updating cart:', err);
		res.status(500).json({ error: 'Failed to update cart' });
	}
});

// ✅ Remove item
router.put('/remove/:id', authMiddleware, async (req, res) => {
	const productId = req.params.id;

	try {
		const db = await getDb();
		
		const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(req.body.user.id) });

		let cart = (user?.cart || []).filter((item) => item.id !== productId);

		await db.collection('users').updateOne({ _id: ObjectId.createFromHexString(req.body.user.id) }, { $set: { cart } });

		res.json({ items: cart });
	} catch (err) {
		console.error('Error removing from cart:', err);
		res.status(500).json({ error: 'Failed to remove item' });
	}
});

// ✅ Clear cart
router.delete('/clear/:userID', authMiddleware, async (req, res) => {
	try {
		const db = await getDb();
		await db.collection('users').updateOne({ _id: ObjectId.createFromHexString(req.params.userID) }, { $set: { cart: [] } });

		res.json({ items: [] });
	} catch (err) {
		console.error('Error clearing cart:', err);
		res.status(500).json({ error: 'Failed to clear cart' });
	}
});

module.exports = router;
