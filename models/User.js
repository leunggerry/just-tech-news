const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    // Table column definitions Go Here
    id: {
      // use the special sequelize datatypes object provide what type of data it is
      type: DataTypes.INTEGER,
      // this is equivalent of SQl's `NOT NULL` option
      allowNull: false,
      //instruct that htis is the primary key
      primaryKey: true,
      //turn on auto increment
      autoIncrement: true,
    },
    // define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creatingn the table data
      validate: {
        isEmail: true,
      },
    },
    //define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means the password must be at least 4 chars long
        len: [4],
      },
    },
  },
  {
    // Table configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration)

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    //don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    //don't pluralize name of database table
    freezeTableName: true,
    //use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: "user",
  }
);

module.exports = User;
