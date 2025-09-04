const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:
true },
name: String,
sku: String,
priceAtPurchase: Number,
quantity: Number,
});
const orderSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [orderItemSchema],
total: { type: Number, required: true },
status: { type: String, enum: ['placed', 'cancelled'], default: 'placed' },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);