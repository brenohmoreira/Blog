// This is category article
const sequelize = require("sequelize");
const connection = require("../../database/database");

// To make the relationship with the category and article
const Category = require("../categories/Category");

// Categories have titles and your slug. Slug is how will show in URL (ex: educação física, slug: educacao-fisica)
const Article = connection.define('articles', {
    title: 
    {
        type: sequelize.STRING,
        allowNull: false
    }, 
    slug: 
    {
        type: sequelize.STRING,
        allowNull: false
    },
    body:
    {
        type: sequelize.TEXT,
        allowNull: false
    }
})

// One article belongs to one category (1x1)
Article.belongsTo(Category);
// If it were 1xN / Nx1: Category.hasMany(Article) (One category has many articles)

// To force the database to create the relationships and tables (Whenever the server is on, do it all over again if force: true)
Article.sync({force: false});

module.exports = Article;