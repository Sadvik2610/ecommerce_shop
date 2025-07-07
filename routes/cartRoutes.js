const express = require('express');
const { CartItem, Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const items = await CartItem.findAll({
    where: { userId: req.user.id },
    include: Product,
  });
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const [item, created] = await CartItem.findOrCreate({
    where: { userId: req.user.id, productId },
    defaults: { quantity },
  });
  if (!created) {
    item.quantity += quantity;
    await item.save();
  }
  res.status(201).json(item);
});

router.put('/:productId', auth, async (req, res) => {
  const item = await CartItem.findOne({
    where: { userId: req.user.id, productId: req.params.productId },
  });
  if (!item) return res.status(404).json({ message: 'Not in cart' });
  item.quantity = req.body.quantity;
  await item.save();
  res.json(item);
});

router.delete('/:productId', auth, async (req, res) => {
  await CartItem.destroy({
    where: { userId: req.user.id, productId: req.params.productId },
  });
  res.json({ message: 'Removed' });
});

module.exports = router;
