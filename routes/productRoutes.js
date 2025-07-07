const express = require('express');
const { Product } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const where = search
    ? { name: { [Product.sequelize.Op.like]: `%${search}%` } }
    : {};

  const products = await Product.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit: +limit,
  });

  res.json({
    total: products.count,
    page: +page,
    pages: Math.ceil(products.count / limit),
    data: products.rows,
  });
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', auth, authorize('admin'), async (req, res) => {
  const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(await Product.findByPk(req.params.id));
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  const deleted = await Product.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
