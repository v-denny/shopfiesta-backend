# ShopFiesta E-Commerce API (Backend)

This repository contains the **server-side backend** for the ShopFiesta e-commerce application. Built with Node.js and Express, it provides a robust RESTful API that handles user synchronization, persistent cart/wishlist storage, and secure payment processing via Stripe.

> **Frontend Client:** This API powers the ShopFiesta React frontend. You can find the frontend repository [here](https://github.com/v-denny/shopfiesta).

## 🛠 Technology Stack
* **Environment:** Node.js & Express.js
* **Database:** MongoDB Atlas & Mongoose
* **Payment Gateway:** Stripe Checkout API
* **Deployment:** Railway

## ✨ Key Features & Implementation
* **User Synchronization:** Exposes a secure endpoint to sync authenticated Firebase users with the MongoDB database, ensuring a valid `User` document exists before allowing cart or wishlist operations.
* **Persistent Cart & Wishlist APIs:** RESTful routes that allow the frontend to add, remove, and update quantities. Uses strict MongoDB operations (like `$pull` and index targeting) to prevent data duplication and race conditions.
* **Secure Payment Processing:** Acts as the secure middleman for Stripe integrations. Maps frontend cart items directly to Stripe `line_items` to guarantee pricing integrity and prevent client-side price manipulation.
* **Environment-Aware Redirection:** Dynamically routes successful or canceled Stripe checkout sessions back to the correct frontend URL based on the environment (Local vs. Production).

## 🚀 Future Roadmap (Phase 3)
* **Stripe Webhooks:** Implement raw body parsing to listen for Stripe's `checkout.session.completed` events, ensuring secure generation of `Order` documents independent of frontend client behavior.
* **Order History API:** Create endpoints to query past user orders for the frontend dashboard.
* **Admin Middleware:** Implement custom Express middleware to verify user roles for protected administrative routes (e.g., product creation/deletion).

## 💻 Running Locally

1. Clone the repository:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/shopfiesta-backend.git](https://github.com/YOUR_USERNAME/shopfiesta-backend.git)
    cd shopfiesta-backend

2. Install dependencies: `npm install`

3. Create a .env file in the root directory and add your configuration:
    ```PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    STRIPE_SECRET_KEY=your_stripe_test_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

**Ensure this points to your running frontend client:** `CLIENT_URL=http://localhost:5173`

4. Start the server: `npm start` or `npm run dev` if using nodemon