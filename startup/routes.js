
const express = require("express");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // const admin = require("../routes/admin");
    const auth = require("../routes/auth");
    const users = require("../routes/users");
    const content = require("../routes/content");

    app.use("/auth", auth);
    app.use("/users", users);
    app.use("/content", content);
    app.get("*", (req, res)=>{
        res.send({code: 404, message: "invalid request.please check our api documentation for all routes"});
    });
}