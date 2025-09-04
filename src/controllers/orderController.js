const Product = require('../models/Product');
const Order = require('../models/Order');
const { placeOrderSchema } = require('../utils/validators');
// Helper: atomic decrement for a single product
async function decrementStock(productId, qty) {
    const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty }, isDeleted: false },
        { $inc: { stock: -qty } },
        { new: true }
    );
    return updated;
}
exports.placeOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const parsed = placeOrderSchema.parse(req.body);
        const itemsToRestore = [];
        const orderItems = [];
        let total = 0;
        try {
            // For each requested item, attempt atomic stock decrement
            for (const it of parsed.items) {
                const product = await decrementStock(it.productId, it.quantity);
                if (!product) throw new Error(`Insufficient stock for product ${it.productId}`);
                // store for potential rollback
                itemsToRestore.push({ productId: product._id, qty: it.quantity });
                orderItems.push({
                    productId: product._id,
                    name: product.name,
                    sku: product.sku,
                    priceAtPurchase: product.price,
                    quantity: it.quantity,
                });
                total += product.price * it.quantity;
            }
            const order = await Order.create({
                user: userId, items: orderItems,
                total
            });
            return res.status(201).json(order);
        } catch (err) {
            // rollback any decremented stock
            for (const r of itemsToRestore) {
                await Product.findByIdAndUpdate(r.productId, {
                    $inc: {
                        stock:
                            r.qty
                    }
                });
            }
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        if (err.name === 'ZodError') return res.status(400).json({
            message:
                err.errors
        });
        next(err);
    }
};
exports.getOrdersForUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};
