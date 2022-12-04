// Routes related to categories

const express = require("express");
const slugify = require("slugify");

// We'll use routes with the object "router" of the express
const router = express.Router();

const Category = require("../categories/Category");
const Article = require("./Article");

// router.[...] instead of app.[...]
router.get("/articles", (req, res) => {
    res.send("Hello World");
});

router.get("/admin/articles", (req, res) => {
    // Include the model "Category" with yours respective relations // joins
    Article.findAll({ include: [{model: Category}]}).then(articles => { res.render("admin/articles/index", {articles: articles}) });
});

router.get("/admin/article/edit/:id", (req, res) => {
    var id = req.params.id;

    if(!isNaN(id))
    {
        Article.findByPk(id).then(article => {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories});
            });
        });
    }
    else
    {
        res.redirect("/admin/articles");
    }
});

router.post("/admin/categories/article/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category_id = req.body.category;

    Article.update({title: title, body: body, slug: slugify(title), categoryId: category_id}, {where: {id: id}}).then(() => { res.redirect("/admin/articles")});
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(category => {
        res.render("admin/articles/new", {category: category});
    });
});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;

    if(id != undefined)
    {
        if(!isNaN(id))
        {
            Article.destroy({where:{id:id}}).then(() => {
                    res.redirect("/admin/articles");
            });
        }
        else
        {
            res.redirect("/admin/articles");
        }
    }
    else
    {
        res.redirect("/admin/articles");
    }
});

router.post("/admin/articles/save", (req, res) => {
    var id_category = req.body.category;
    var body = req.body.body;
    var title = req.body.title;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: id_category
    }).then(() => {
        res.redirect("/admin/articles");
    });
    
});

module.exports = router;
