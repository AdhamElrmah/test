const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./routes/items");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// ✅ السماح بالوصول من الـ frontend
app.use(cors());

// Use item routes for /api/items
app.use("/api/items", itemRoutes);
// Use auth routes for /api/auth
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
