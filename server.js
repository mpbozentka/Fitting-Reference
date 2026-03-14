const path = require("path");
const express = require("express");
const { BRANDS, CROSS_REF } = require("./data/brands");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const brandKeys = Object.keys(BRANDS);
  res.render("index", {
    BRANDS,
    CROSS_REF,
    brandKeys,
    defaultBrand: "titleist",
    defaultCategory: "drivers",
  });
});

// Optional JSON API for client-side use
app.get("/api/brands", (req, res) => res.json(BRANDS));
app.get("/api/brands/:key", (req, res) => {
  const data = BRANDS[req.params.key];
  if (!data) return res.status(404).json({ error: "Brand not found" });
  res.json(data);
});
app.get("/api/cross-ref", (req, res) => res.json(CROSS_REF));

app.listen(PORT, () => {
  console.log(`Fitting Reference running at http://localhost:${PORT}`);
});
