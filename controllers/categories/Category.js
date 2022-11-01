// This is category model
const sequelize = require("sequelize");
const connection = require("../../database/database");

// Categories have titles and your slug. Slug is how will show in URL (ex: educação física, slug: educacao-fisica)
const Category = connection.define('categories', {
    title: 
    {
        type: sequelize.STRING,
        allowNull: false
    }, 
    slug: 
    {
        type: sequelize.STRING,
        allowNull: false
    }
})

// To force the database to create the relationships and tables (Whenever the server is on, do it all over again if force: true)
Category.sync({force: false});

module.exports = Category;