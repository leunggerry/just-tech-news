const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
//for static file paths
const path = require("path");
//app template engine
const exphbs = require("express-handlebars");

//template engine
const hbs = exphbs.create({});

// express applicaiton
const app = express();
const PORT = process.env.PORT || 3001;

//template enginer settings
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//for static files in the current dir
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
//what is extended
app.use(express.urlencoded({ extended: true }));

//turn on routes
app.use(routes);

// turn on connection to db and server
// force -sync : false - will not drop and recreate the database tables
// force - sync if set to true, it would drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("now listening"));
});
