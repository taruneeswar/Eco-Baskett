const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid product id' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name and price are required' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'price must be a valid non-negative number' });
    }

    const product = await Product.create({
      name: String(name).trim(),
      description,
      price: numericPrice,
      image,
      category,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'products must be a non-empty array' });
    }

    const prepared = products.map((p) => ({
      name: p.name,
      description: p.description,
      price: Number(p.price),
      image: p.image,
      category: p.category,
    }));

    const invalid = prepared.some((p) => !p.name || Number.isNaN(p.price) || p.price < 0);
    if (invalid) {
      return res.status(400).json({ message: 'each product must include valid name and non-negative price' });
    }

    const created = await Product.insertMany(prepared, { ordered: false });
    res.status(201).json({ createdCount: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add products' });
  }
});

module.exports = router;
