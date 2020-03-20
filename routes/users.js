const { ensureAuthenticated, ensureAuthorized, forwardAuthenticated } = require("../middlewares/auth");
const { User } = require("../models/users");
const express = require('express');
const router = express.Router();

router.get('/me', ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/', ensureAuthorized, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.send(users);
});


module.exports = router;