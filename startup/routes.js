
const express = require("express");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // const index = require("../routes/index");
    // const admin = require("../routes/admin");
    const auth = require("../routes/auth");
    const users = require("../routes/users");

    app.use("/auth", auth);
    app.use("/users", users);
    app.get("*", (req, res)=>{
        res.redirect('/')
    });
}