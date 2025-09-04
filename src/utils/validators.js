const { z } = require('zod');
const registerSchema = z.object({
name: z.string().min(2),
email: z.string().email(),
password: z.string().min(6),
});
const loginSchema = z.object({
email: z.string().email(),
password: z.string().min(6),
});
const productCreateSchema = z.object({
name: z.string().min(1),
sku: z.string().min(1),
price: z.number().nonnegative(),
stock: z.number().int().nonnegative(),
});
const placeOrderSchema = z.object({
items: z.array(z.object({ productId: z.string().min(1), quantity:
z.number().int().positive() })).min(1),
});
module.exports = {
registerSchema,
loginSchema,
productCreateSchema,
placeOrderSchema,
};