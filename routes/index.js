// Another file to collect the packaged API routes
// API end points and prefixing them witht he path a /api
// second use of the router.use() for the request to any endpoint that doesnt expist, a 404 eror is returned
// needed for scaling
const router = require("express").Router();

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
