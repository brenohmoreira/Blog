// Routes related to categories

const express = require("express");

// We'll use routes with the object "router" of the express
const router = express.Router();
const Category = require("./Category");

// Using slugfy to transforme names/titles in slugs for the URLS (npm install --save slugify OR slugfy (I don't remember))
const slugify = require("slugify");

// Middleware
const admin_auth = require("../../middlewares/admin_auth");

// router.[...] instead of app.[...]
router.get("/categories", (req, res) => {
    res.send("Hello World");
});

router.get("/admin/categories", admin_auth, (req, res) => {
    
    // Find all informations of the table "Category", put it in variable "categories" and, if successfully, render the page "index" with the array "all_categories" equal the array "categories"
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {all_categories: categories});
    });

});

router.get("/admin/categories/new", admin_auth, (req, res) => {
    // res.send("Route to create new categories");

    // Folder "views" is preselected by express
    res.render("admin/categories/new");
});

// Method "post" to work with forms
// Route to save the new categories
router.post("/admin/categories/save", admin_auth, (req, res) => {

    var title = req.body.title;

    if(title != undefined)
    {
        // Creating a new data with Category model (Category column)
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }
    else
    {
        res.redirect("/admin/categories/new");
    }
    
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;

    if(id != undefined) 
    { 
        if(!isNaN(id)) 
        {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }
        else 
        {
            res.redirect("/admin/categories");
        }
    }
    else 
    {
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", admin_auth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id))
    {
        res.redirect("/admin/categories");
    }
    else
    {
        // findByPk is a method to search the category with the id
        Category.findByPk(id).then((category) => {
            if(category != undefined)
            {
                res.render("admin/categories/edit", {category: category});
            }
            else
            {
                res.redirect("/admin/categories");
            }
        }).catch(erro => {
            res.redirect("/admin/categories");
        });
    }

});

router.post("/admin/categories/update", admin_auth, (req, res) => {
    var id_form = req.body.id;
    var title_form = req.body.title;

    // Updating the category with title = title_form where your id = id_form of the ejs archive
    Category.update({title: title_form, slug: slugify(title_form)}, {where: {id: id_form}}).then(() => { res.redirect("/admin/categories") });
});

module.exports = router;
