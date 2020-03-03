const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    console.log("starting db connection");
    const db = config.get('db');
    mongoose.connect(db, {
            useNewUrlParser: true
        })
        .then(() => console.log(`Connected to ${db}...`))
        .catch(err => console.error(err))
}