function admin_auth(req, res, next)
{
    // Not logged in
    if(req.session.user == undefined)
    {
        res.redirect("/");
    }
    else
    {
        // This method (next) allow the user to join in route. If we don't use, they can't access it
        next();
    }
}

module.exports = admin_auth;