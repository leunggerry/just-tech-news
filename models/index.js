const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote");
const Comment = require("./Comment");
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

// associate User and Post to another in a way that when we query Post, we can see total
// of how many votes a user creates; and when we query a User, we can see all the posts
// they've voted on

// belongsToMany, allow both User and Post models to query each other's
// information in the context of a vote.

// if we wanted to seep which users voted on a single post
User.belongsToMany(Post, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "user_id",
});

// if we wanted to see which posts a single user voted on
Post.belongsToMany(User, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "post_id",
});

//connect user to vote
Vote.belongsTo(User, {
  foreignKey: "user_id",
});

//connect post to vote
Vote.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Vote, {
  foreignKey: "user_id",
});

Post.hasMany(Vote, {
  foreignKey: "post_id",
});

// comment associates
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});
module.exports = { User, Post, Vote, Comment };
