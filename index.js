const express = require('express');

const body_parser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./controllers/categories/CategoriesController');
const articlesController = require('./controllers/articles/ArticlesController');
const app = express();

const Article = require('./controllers/articles/Article');
const Category = require('./controllers/categories/Category');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

connection.authenticate().then(() => console.log('The connection was a success')).catch((error) => console.log('There was a failure in the database connection process: ' + error));

// Telling for the "index.js" to use the routes of the "categoriesController"
// We use "/" to say what the user should put in the URL after routes of the "CategoriesController"
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => 
{
    res.render("index");
})

app.listen(8080, () =>  {
    console.log("The server is running");
})
 