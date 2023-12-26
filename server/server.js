const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);

//HTTP logger
app.use(morgan("combined"));

app.listen(port, () => {
  console.log("App listening in " + port);
});
