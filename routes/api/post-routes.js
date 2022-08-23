// include express.js api endpoints
const router = require("express").Router();
const { Post, User, Vote } = require("../../models");
const sequelize = require("../../config/connection");

/* include User Model - to retrieve not only info about each post but also the user 
   that posted it
*/

// get all users
router.get("/", (req, res) => {
  console.log("======================");
  Post.findAll({
    // Query config
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"), "vote_count"],
    ],
    /*created_at column is auto-generated at the time a post is
    created with the current date and time, thanks to Sequelize. We
    do not need to specify this column or the updated_at column in
     the model definition, because Sequelize will timestamp these 
     fields by default unless we configure Sequelize not to.
     */
    //set the order property
    order: [["created_at", "DESC"]],
    // include the JOIN to the User table
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a single post
// use only findOne
// retreive username in the user by using the include property
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"), "vote_count"],
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a post
// user req.body to populate the columns in the post table
// create_at and update_at constraints stated that fields cannot be NOT NULL
// SEQUELIZE includes CURRENT_TIMESTAMP
router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//put below post route because /:id routes will think /upvote is valid param of /:id
//PUT //api/post/upvote
router.put("/upvote", (req, res) => {
  //custom static method created in models/Post.js
  Post.upvote(req.body, { Vote })
    .then((updatedDbPostData) => res.json(updatedDbPostData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  // Vote.create({
  //   user_id: req.body.user_id,
  //   post_id: req.body.post_id,
  // })
  //   .then(() => {
  //     //then find the post we just voted on
  //     return Post.findOne({
  //       where: {
  //         id: req.body.post_id,
  //       },
  //       attributes: [
  //         "id",
  //         "post_url",
  //         "title",
  //         "created_at",
  //         // use raw mySql aggreate function query to get a count of how many votes the post has and return it under the name 'vote_count'
  //         [
  //           sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"),
  //           "vote_count",
  //         ],
  //       ],
  //     })
  //       .then((dbPostData) => {
  //         res.json(dbPostData);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         res.status(400).json(err);
  //       });
  //   })
  //   .catch((err) => res.json(err));
});

//parameter end points

//update post
// used the req.body.title value to replace the title of the post
//
router.put("/:id", (req, res) => {
  Post.update(
    {
      title: req.body.title,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Delete a post
// the response displays the number of rows or entries that were affected by the query
router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
