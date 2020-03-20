const cors = require('cors')
const config = require("config");
const app = require("express")();
const mongoose = require("mongoose");

//get all the db values from the app config
let dbUrl =  process.env.MONGOGB_URI || config.get("db");

//set indexes
mongoose.set("useCreateIndex", true);

//db connection
mongoose .connect(dbUrl, { useNewUrlParser: true })
    .then(() => console.log(`Connected to ${dbUrl}...`))
    .catch(err => console.error(err));

app.use(cors())

require("./startup/routes")(app);

const port = process.env.PORT || 3001;
console.log({ 'environment': app.settings.env });
app.listen(port, () => console.log(`listening on port ${port}`));