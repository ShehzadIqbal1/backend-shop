const Product = require('../models/Product');
const { productCreateSchema } = require('../utils/validators');
exports.createProduct = async (req, res, next) => {
    try {
        const payload = productCreateSchema.parse(req.body);
        const existing = await Product.findOne({ sku: payload.sku });
        if (existing) return res.status(400).json({ message: 'SKU already exists' });
        const p = await Product.create(payload);
        res.status(201).json(p);
    } catch (err) {
        if (err.name === 'ZodError') return res.status(400).json({
            message:
                err.errors
        });
        next(err);
    }
};
exports.listProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const q = req.query.q ? { name: { $regex: req.query.q, $options: 'i' } } :
            {};
        const filter = { isDeleted: false, ...q };
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json({ page, limit, total, data: products });
    } catch (err) {
        next(err);
    }
};
exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        if (payload.sku) {
            const existing = await Product.findOne({
                sku: payload.sku, _id: {
                    $ne:
                        id
                }
            });
            if (existing) return res.status(400).json({
                message: 'SKU already exists'
            });
        }
        const updated = await Product.findByIdAndUpdate(id, payload, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};
exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const p = await Product.findByIdAndUpdate(id, { isDeleted: true }, {
            new:
                true
        });
        if (!p) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Deleted (soft)', product: p });
    } catch (err) {
        next(err);
    }
};