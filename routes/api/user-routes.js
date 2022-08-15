const router = require("express").Router();

const { User } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
  // access our user model and run .findaAll() method
  User.findAll({
    // passing an object into the method
    // attributes key and instructed the query to exclude the password column
    // array as attributes to add more possilbiy
    attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get /api/users/1
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json;
    });
});

// POST /api/users
router.post("/", (req, res) => {
  // expects {username: "g", email: "g@gmail.com", password: "passowrd1234"}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST method is used for most login reqests
// GET method carries the req param appended in the URL string, whereas post method carries the request in the req.body
// which is more secure in transferring data from client to server.
router.post("/login", (req, res) => {
  // expect: {email: "g@gmail.com", passworkd: "password1234"}
  //user query
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }

    //user validation
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    res.json({ user: dbUserData, message: "You are now logged in!" });
  });
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
  // expects {username: 'g', email: 'g@gmail.com', password: 'password1234'}
  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "no user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete /api/users/1
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
