const express = require("express");
const User = require("./User");

// To make hash in informations of the users. It is like with cryptography, but is irreversible
const bcrypt = require("bcryptjs");

// Middleware
const admin_auth = require("../../middlewares/admin_auth");

const router = express.Router();

router.get("/admin/user", admin_auth, (req, res) => {
    if(req.session.user == undefined)
    {
        res.redirect("/");
    }
    User.findAll().then(users => {
        res.render("admin/user/index", {users: users});
    });
});

router.get("/admin/user/create", admin_auth, (req, res) => {
    res.render("admin/user/create");
});

router.post("/user/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var username = req.body.username;

    // res.json({email, password, confirm_password, username}); --> test

    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined)
        {
            var salt = bcrypt.genSaltSync(10);
            // Hash in password
            var hash = bcrypt.hashSync(password, salt);

            if(password == confirm_password)
            {
                User.create({
                    email: email,
                    password: hash,
                    username: username
                }).then(() => {
                    res.redirect("/");
                }).catch(() => {
                    res.redirect("/");
                });
            }
            else
            {
                res.redirect("/");
            }
        }
        else
        {
            res.redirect("/admin/user/create");
        }
    })
});

router.get("/login", (req, res) => {
    res.render("admin/user/login");
});

router.post("/login/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) // If exists
        {   
            // Compare password (hash) with user.password hash
            var correct = bcrypt.compareSync(password, user.password);

            if(correct)
            {
                // Creating session
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
                // Test ==> res.json(req.session.user);

                res.redirect("/");
            }
            else
            {
                res.redirect("/login");
            }
        }
        else
        {
            res.redirect("/login");
        }
    });
});

module.exports = router;