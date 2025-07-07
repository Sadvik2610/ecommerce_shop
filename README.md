# ecommerce_shop
A lightweight Node + Express + MySQL REST API with a tiny vanilla‑JS frontend.

## 📂 Project layout
```
simple-shop/
├── package.json
├── .env.example
├── public/        ← static frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── src/           ← backend
    ├── server.js
    ├── config/
    │   └── database.js
    ├── models/
    ├── middleware/
    └── routes/
```
## 🚀 Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure MySQL & env**
   ```bash
   cp .env.example .env
   # then edit .env with your own DB password & JWT secret
   ```
   Create the database/user if you haven’t:
   ```sql
   CREATE DATABASE ecommerce_db DEFAULT CHARACTER SET utf8mb4;
   CREATE USER 'shop_user'@'localhost' IDENTIFIED BY 'Str0ngP@ss!';
   GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'shop_user'@'localhost';
   ```
3. **Run in dev mode**
   ```bash
   npm run dev
   ```
   The server listens at **http://localhost:5000** and serves the frontend from `public/`.
4. **Open the app**
   <http://localhost:5000> – register a user, log in, add products via Postman (or make one user an admin) and play.
