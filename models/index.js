const User = require("./User");
const Post = require("./Post");

// define relationship between User and Post
// create association with Sequelize
// creates reference for the id column in the User model to link to the FK pair, which is
// user_id in the Post model
User.hasMany(Post, {
  foreignKey: "user_id",
});

// define the relation ship of the Post model to the User model. 
// constraint imposed here is the post can belong to one user, but not many users
Post.belongsTo(User, {
  foreignKey: "user_id",
});
module.exports = { User, Post };
