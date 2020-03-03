const { User } = require("../models/users");

module.exports = {
  forwardAuthenticated: (req, res, next) => {
    if (!req.session.user) {
      return next()
    }
    let previous = req.originalUrl;
    if (previous != "/login" && previous != "/register" && previous != undefined && previous.length < 20) {
      res.redirect(previous);
    } else {
      res.redirect("/");
    }
  },
  ensureAuthenticated: (req, res, next) => {
    if (req.session.user) {
      return next()
    }
    req.session.redirectUrl = req.originalUrl;

    res.redirect('/login');
  },
  ensurePostAuthenticated: (req, res, next) => {
    console.log(req.body);
    if (req.session.user) {
      return next()
    }
    res.send({
      error: 401,
      message: "please login first",
      data: {}
    });
  },
  ensureAuthorized: async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    let admin_id = req.session.user;
    let admin = await User.findOne({user_id: admin_id});
    let {isAdmin} = admin;
    if (isAdmin) { //Admin.
      next();
    } else if (Admins.includes(admin.email.toLowerCase())){
      await User.findOneAndUpdate({user_id:admin_id},{isAdmin:true}); //Make Admin
      next();
    } else res.redirect('/user'); // not Admin
  },
  ensurePostAuthorized: async (req, res, next) => {
    console.log(req.body);
    if (!req.session.user) {
      return res.send({
        error: 401,
        message: "please login first",
        data: {}
      });
    }
    let admin_id = req.session.user;
    let admin = await User.findOne({user_id: admin_id});
    let {isAdmin} = admin;
    if (isAdmin) { //Admin.
      next();
    }else  res.send({ //Not an admin.
      error: 401,
      message: "Unauthorized to perform this action",
      data: {}
    });
  },
}