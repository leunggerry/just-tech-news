// Means to collect all of the API routes and package them up
const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const postRoutes = require("./post-routes");

// expose them to the URL path so assignment ot the Express.js router
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

module.exports = router;
