const express = require("express");
const cors = require("cors");
const bfhlRoutes = require("./routes/bfhl");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.json({ status: "ok", ts: Date.now() }));

app.use("/", bfhlRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack || err.message);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.use((_req, res) => res.status(404).json({ error: "Route not found." }));

// start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
