const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash("auth_err", "You're not authentificated!");
  res.redirect("/signup");
};

module.exports = isAuth;
