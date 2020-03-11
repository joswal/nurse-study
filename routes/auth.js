const bcrypt = require("bcrypt");
const uuidv1 = require('uuid/v1');
const router = require("express").Router();

const { User, validate } = require("../models/users");
const { ensureAuthenticated, ensurePostAuthenticated, forwardAuthenticated } = require("../middlewares/auth");

router.post("/login", forwardAuthenticated, async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)  return res.send({
     code: 400,
      message: "please enter all details",
      data: {}
    });

    let user = await User.findOne({ email });
    if (!user) return res.send({
     code: 400,
      message: "Invalid email or password",
      data: {}
    });
  
    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send({
     code: 400,
      message: "Invalid email or password",
      data: {}
    });

    const token = user.generateAuthToken();
    res.send({
     code: 200,
      message: "Successfully Logged in",
      token: token
    });
  } catch (error) {
    res.send({
     code: 400,
      message: "An error occurred"
    });
  }
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  let { firstname, email, password} = req.body;
  try {
    let { error } = validate(req.body);
    if (error) return res.send({
     code: 400,
      message: error.details[0].message,
    });
  
    let user = await User.findOne({ email });
    if (user) return res.send({
     code: 400,
      message: "User already registered.",
    });
  
    let user_id = uuidv1();
    user = new User({
      user_id,
      firstname,
      email,
      password,
    });
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    let new_user = await user.save();
    res.send({
      code: 200,
      message: "user registered successfully,proceed to login now",
      data: { new_user }
    });
  } catch (error) {
    res.send({
     code: 400,
      message: "An error occurred",
      data: error
    });
  }
});

router.post("/change-password", ensurePostAuthenticated, async (req, res) => {
  try {
    let user_id = req.session.user;
    let { password, newPassword } = req.body;
    if (!password || !newPassword) return res.send({
     code: 400,
      message: 'Kindly fill all inputs',
      data: {}
    });
    let user = await User.findOne({ user_id });
    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send({
     code: 400,
      message: "Wrong Password",
      data: {}
    });
    user = await updatePassword(user_id, newPassword)
    res.send({error: 200,
      message: "Password successfully changed,login now",
      data: {}});
  } catch (error) {
    res.send({
     code: 400,
      message: "An Error Occurred",
      data: { error }
    });
  }
});


module.exports = router;
