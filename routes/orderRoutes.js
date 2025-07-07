const express = require('express');
const { CartItem, Order, OrderItem, Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const cartItems = await CartItem.findAll({ where: { userId: req.user.id } });
  if (!cartItems.length) return res.status(400).json({ message: 'Cart empty' });

  const order = await Order.create({ userId: req.user.id });
  await OrderItem.bulkCreate(
    cartItems.map(ci => ({
      OrderId: order.id,
      ProductId: ci.productId,
      quantity: ci.quantity,
    }))
  );
  await CartItem.destroy({ where: { userId: req.user.id } });

  res.status(201).json({ orderId: order.id });
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: Product,
  });
  res.json(orders);
});

module.exports = router;
