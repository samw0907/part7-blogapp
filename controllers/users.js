const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const usersRouter = express.Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1 });

  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate("blogs", { title: 1 });
    if (user) {
      response.json(user);
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid user ID" });
  }
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
