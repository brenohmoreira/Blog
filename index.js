const express = require('express');

const body_parser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./controllers/categories/CategoriesController');
const articlesController = require('./controllers/articles/ArticlesController');
const usersController = require('./controllers/user/UserController');
const app = express();
const session = require('express-session');

const Article = require('./controllers/articles/Article');
const Category = require('./controllers/categories/Category');
const User = require('./controllers/user/User');
const { default: slugify } = require('slugify');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

// Config session (secret is a password)
// Max age is the life of the cookie to identify the session
app.use(session({
    secret: "bjk!@045812mbnasgkjaol",
    cookie: { maxAge: 300000 }
}));

connection.authenticate().then(() => console.log('The connection was a success')).catch((error) => console.log('There was a failure in the database connection process: ' + error));

// Telling for the "index.js" to use the routes of the "categoriesController"
// We use "/" to say what the user should put in the URL after routes of the "CategoriesController"
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => 
{
    var slug = '';
    // Order of the id desc
    Article.findAll({order: [['id','DESC']], limit: 4}).then((articles) => {
        Category.findAll().then((categories) => {
            res.render("index", {articles: articles, categories: categories, slug: slug});
        })
    });
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;

    Article.findOne({where: {slug: slug}}).then((article) => {
        if(article != undefined)
        {
            Category.findAll().then((categories) => {
                res.render("article", {article: article, categories: categories});
            });
        }
        else
        {
            res.redirect("/");
        }
    }).catch( error => {
        res.redirect("/");
    });
    
});

app.post("/category", (req, res) => {
    var title = req.body.title;
    var slug = slugify(title);

    res.redirect("/category/" + slug);
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    // Find categories where slug: slug of the param and include all articles of the model Article that are relates with finded category
    Category.findOne({ where: { slug: slug }, include: [{model: Article}]}).then(category => {
        if(category != undefined)
        {
            // Find and send for the index all articles of the array categories.article. Just can use that array because of the include
            // category.articles (=articles) are all articles of the category finded
            Category.findAll().then((categories) => {
                // Join of the category and article (category and your articles)
                res.render("index", {articles: category.articles, categories: categories, slug: slug});
            });
        }
        else
        {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.listen(8080, () =>  {
    console.log("The server is running");
});
 