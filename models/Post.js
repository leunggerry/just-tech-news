//use Model and Datatypes from sequelize package
const { Model, DataTypes } = require("sequelize");
//get the mysql connection from the connneciton.js
const sequelize = require("../config/connection");

//create the POST model
class Post extends Model {
  //class method
  // static keyword to base method of the Post model
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "post_url",
          "title",
          "created_at",
          [
            sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"),
            "vote_count",
          ],
        ],
      });
    });
  }
}

// Define the columns in the POST
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
