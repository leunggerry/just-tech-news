const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create our User model
class User extends Model {
  // setup method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

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
    hooks: {
      //set up beforeCreate lifecyle "hook" functionality
      // 1. execute the bcrypt hash function on plain
      // 2. in the has function, pass the userData ojbect that contains the plaintext password in the password property and the saltRound (10)
      // 3. hashed passowrd is generated and passed to the Promise Object as newUserData with a hashed password property. The return statement returns the ahsed password
      // beforeCreate(userData) {
      //   return bcrypt.hash(userData.password, 10).then((newUserData) => {
      //     return newUserData;
      //   });

      //USE async/wait
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      //setup hash when password is updated
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
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
