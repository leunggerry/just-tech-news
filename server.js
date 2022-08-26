const express = require("express");

//for static file paths
const path = require("path");
//app template engine
const exphbs = require("express-handlebars");

const session = require("express-session");

//const routes = require("./controllers/");
const sequelize = require("./config/connection");

//sequelize store
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//create session
const sess = {
  secret: process.env.SESS_SECRET ? process.env.SESS_SECRET : "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// express applicaiton
const app = express();
const PORT = process.env.PORT || 3001;

//template engine
const hbs = exphbs.create({});

//app use session cookie
app.use(session(sess));

//template enginer settings
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
//what is extended
app.use(express.urlencoded({ extended: false }));
//for static files in the current dir
app.use(express.static(path.join(__dirname, "public")));
//turn on routes
app.use(require("./controllers/"));

// turn on connection to db and server
// force -sync : false - will not drop and recreate the database tables
// force - sync if set to true, it would drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("now listening"));
});
