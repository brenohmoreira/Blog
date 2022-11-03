// Routes related to categories

const express = require("express");

// We'll use routes with the object "router" of the express
const router = express.Router();
const Category = require("./Category");
// Using slugfy to transforme names/titles in slugs for the URLS (npm install --save slugify OR slugfy (I don't remember))
const slugify = require("slugify");

// router.[...] instead of app.[...]
router.get("/categories", (req, res) => {
    res.send("Hello World");
});

router.get("/admin/categories/new", (req, res) => {
    // res.send("Route to create new categories");

    // Folder "views" is preselected by express
    res.render("admin/categories/new");
});

// Method "post" to work with forms
router.post("/admin/categories/save", (req, res) => {
    // Route to save the new categories

    var title = req.body.title;

    if(title != undefined)
    {
        // Creating a new data with Category model (Category column)
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/");
        })
    }
    else
    {
        res.redirect("/admin/categories/new");
    }
});

module.exports = router;
