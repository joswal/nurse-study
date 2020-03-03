
const express = require("express");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // const index = require("../routes/index");
    // const admin = require("../routes/admin");
    // const user = require("../routes/user");
    const auth = require("../routes/auth");

    app.use("/auth", auth);
    app.get("*", (req, res)=>{
        res.redirect('/')
    });
}