const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB Error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use((req, res) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log("App listening at port ${PORT}");
});
