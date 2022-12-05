// Routes related to categories

const express = require("express");
const slugify = require("slugify");

// We'll use routes with the object "router" of the express
const router = express.Router();

const Category = require("../categories/Category");
const Article = require("./Article");

// Middleware
const admin_auth = require("../../middlewares/admin_auth");

// router.[...] instead of app.[...]
router.get("/articles", (req, res) => {
    res.send("Hello World");
});


// Struct: router.get("route", "middleware extern", "function res/req")
router.get("/admin/articles", admin_auth, (req, res) => {
    // Include the model "Category" with yours respective relations // joins
    Article.findAll({ include: [{model: Category}]}).then(articles => { res.render("admin/articles/index", {articles: articles}) });
});

router.get("/admin/article/edit/:id", admin_auth, (req, res) => {
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

router.post("/admin/categories/article/update", admin_auth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category_id = req.body.category;

    Article.update({title: title, body: body, slug: slugify(title), categoryId: category_id}, {where: {id: id}}).then(() => { res.redirect("/admin/articles")});
});

router.get("/admin/articles/new", admin_auth, (req, res) => {
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

router.post("/admin/articles/save", admin_auth, (req, res) => {
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

// Pagination
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    // Return all articles and the amount exists. Limit of 4 articles. Offset make the contage from ...
    // In that exemple, we want the offset so: page 1 = offset 0, page 2 = offset 4-7
    if(isNaN(page) || page == 1)
    {
        offset = 0;
    }
    else
    {
        offset = (parseInt(page) - 1) * 4;
        // Ex: page 2: offset = (2 - 1) * 4 => offset = 4
        // eX: page 3: offset = (3 - 1) * 4 => offset = 8
    }

    Article.findAndCountAll({limit: 4, offset: offset, order: [['id', 'DESC']]}).then(articles => {
        // res.json(articles); -> Return all articles with json in page
        // return count (number of articles) and rows (the articles)

        var next;

        if(offset + 4 >= articles.count)
        {
            // Not exists more pages to display
            next = false;
        }
        else
        {
            next = true;
        }

        var result = {next: next, articles: articles, page: parseInt(page)};

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        });
    });
});

module.exports = router;
