const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  socketPath: process.env.DATABASE_SOCKET,
});

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM ANAK ORDER BY TAHUN_MASUK, NAMA, TANGGAL_LAHIR";
  db.query(query, (error, anakData) => {
    if (error) {
      console.log(error);
      res.render("error", { message: "Error retrieving anak data." });
    } else {
      const formattedAnakData = anakData.map((anak) => {
        const dateOfBirth = new Date(anak.tanggal_lahir);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const formattedDateOfBirth = dateOfBirth.toLocaleDateString(
          "id-ID",
          options
        );
        return {
          ...anak,
          tanggal_lahir: formattedDateOfBirth,
        };
      });
      res.render("main", { anakList: formattedAnakData });
    }
  });
});

module.exports = router;
