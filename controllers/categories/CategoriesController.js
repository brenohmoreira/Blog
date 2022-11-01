// Routes related to categories

const express = require("express");

// We'll use routes with the object "router" of the express
const router = express.Router();

// router.[...] instead of app.[...]
router.get("/categories", (req, res) => {
    res.send("Hello World");
});

router.get("/admin/categories/new", (req, res) => {
    res.send("Route to create new categories");
});

module.exports = router;
