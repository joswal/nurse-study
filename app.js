const cors = require('cors')
const config = require("config");
const app = require("express")();
const mongoose = require("mongoose");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);

//get all the db values from the app config
let dbUrl =  process.env.MONGOGB_URI || config.get("db");
//create store for session
const store = new SessionStore({ uri: dbUrl, collection: "sessions"});
//set session config
let sessionConfig = {
    secret: config.get("secret"),
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: false,
        maxAge: 43200000 /*12 hour*/
    }
};

//set indexes
mongoose.set("useCreateIndex", true);
store.on("error", function (error) {
    console.log(error);
});
//set session options
app.use(session(sessionConfig));
//db connection
mongoose .connect(dbUrl, { useNewUrlParser: true })
    .then(() => console.log(`Connected to ${dbUrl}...`))
    .catch(err => console.error(err));

app.use(cors())

require("./startup/routes")(app);

const port = process.env.PORT || 3000;
console.log({ 'environment': app.settings.env });
app.listen(port, () => console.log(`listening on port ${port}`));