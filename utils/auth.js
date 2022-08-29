// middleware function  to authguard routes for authenticated users only
const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    // check for existence of session property
    // otherwise redirect to login page if it doesnt exist
    res.redirect("/login");
  } else {
    // next is the potential next middleware function
    next();
  }
};

module.exports = withAuth;
