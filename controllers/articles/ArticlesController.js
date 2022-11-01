// Routes related to categories

const express = require("express");

// We'll use routes with the object "router" of the express
const router = express.Router();

// router.[...] instead of app.[...]
router.get("/articles", (req, res) => {
    res.send("Hello World");
});

router.get("/admin/articles/new", (req, res) => {
    res.send("Route to create new articles");
});

module.exports = router;
