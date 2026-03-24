const express = require("express");
const path = require("node:path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server running on ${PORT}`);
});
