# 🛒 Shop Backend APIs

A small Node.js backend implementing authentication, product CRUD, and order management.

---

## 🚀 Features
- User registration & login with JWT auth
- Password hashing (bcrypt)
- Product CRUD (admin-only for add/update/delete, soft delete enabled)
- Pagination & search by name for product listing
- Order placement with stock handling & atomic updates
- Input validation with clear error messages

---

## 🛠️ Setup Instructions

### Local Development
```bash
# Clone repo
git clone https://github.com/ShehzadIqbal1/backend-shop
cd <project_folder>

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# fill values like:
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your_secret
# PORT=5000

# Run server
npm start
Run with Docker
bash
Copy code
# Build Docker image
docker build -t shop-backend .

# Run container
docker run -p 5000:5000 --env-file .env shop-backend
➡️ Make sure you have a valid .env file in your project root before running the Docker container.
The --env-file .env option makes sure the container gets the same environment variables.

📌 API Documentation
Import postman_collection.json into Postman.

Use the provided endpoints:

Auth:

POST /api/auth/register

POST /api/auth/login

Products:

POST /api/products (admin only)

GET /api/products?search=abc&page=1&limit=10

PUT /api/products/:id (admin only)

DELETE /api/products/:id (soft delete, admin only)

Orders:

POST /api/orders (user only)

🧪 Demo Data
Register (Admin)
json
Copy code
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
Register (User)
json
Copy code
{
  "name": "Normal User",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
Login
json
Copy code
{
  "email": "admin@example.com",
  "password": "password123"
}
Add Product (Admin only)
json
Copy code
{
  "name": "Laptop",
  "sku": "SKU123",
  "price": 1000,
  "stock": 5
}
Place Order (User)
json
Copy code
{
  "products": [
    { "productId": "PRODUCT_ID", "quantity": 2 }
  ]
}
 Questions & Answers
1. Why is idempotency important when creating an order API? How would you handle duplicate requests?
Idempotency ensures that duplicate requests (like retrying due to network issues) do not create duplicate orders or double charge users.
 Solution: use a unique idempotencyKey (like a client-generated UUID) and check it in the database before creating a new order.

2. What’s the difference between optimistic and pessimistic locking? Which one would you use for updating product stock and why?

Optimistic locking: assumes no conflicts, checks version before commit.

Pessimistic locking: locks the record so only one update can happen at a time.
 For stock updates, atomic DB updates (findOneAndUpdate with condition stock > 0) work best  this is closer to pessimistic locking in practice and prevents overselling.

3. Explain the difference between offset pagination and cursor pagination. Which one is better for large data?

Offset pagination: uses page & limit. Simple but slow for very large datasets because skipping many rows is inefficient.

Cursor pagination: uses a pointer (like _id) for the next page. Faster and more efficient on large datasets.
For large data, cursor pagination is better.

4. How would you make sure two users don’t buy the last product at the same time?
Use an atomic DB operation like:

js
Copy code
findOneAndUpdate(
  { _id: productId, stock: { $gte: quantity } },
  { $inc: { stock: -quantity } },
  { new: true }
);
This ensures only one request will succeed when stock = 1.

