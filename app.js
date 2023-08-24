const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const fs = require("fs");

const app = express();
const PORT = 3500;

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  socketPath: process.env.DATABASE_SOCKET,
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL Connected");
  }
});

app.use("/", require("./routes/pages"));

app.listen(PORT, () => {
  console.log("Server started at 3500");
});
