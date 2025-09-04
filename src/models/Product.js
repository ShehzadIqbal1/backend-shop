const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
name: { type: String, required: true },
sku: { type: String, required: true, unique: true },
price: { type: Number, required: true, min: 0 },
stock: { type: Number, required: true, min: 0 },
isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
3
module.exports = mongoose.model('Product', productSchema);
