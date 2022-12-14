const express = require("express");
const routes = require("./routes");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

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
