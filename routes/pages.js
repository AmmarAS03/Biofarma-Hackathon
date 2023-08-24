const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    socketPath: process.env.DATABASE_SOCKET
})

const router = express.Router();

router.get('/', (req, res) => {
    const query = 'SELECT * FROM anak';
    db.query(query, (error, anakData) => {
        if (error) {
            console.log(error);
            res.render('error', { message: 'Error retrieving anak data.' });
        } else {
            res.render('main', { anakList: anakData });
        }
    });
 
})

// routes/pages.js

router.get('/anak/:id', (req, res) => {
    const anakId = req.params.id;

    // Fetch the child's details and associated rapot data from the database
    const queryAnak = 'SELECT * FROM anak WHERE nisn = ?';
    const queryRapot = 'SELECT * FROM rapot WHERE anak_id = ?';

    db.query(queryAnak, [anakId], (error, anakData) => {
        if (error || anakData.length === 0) {
            console.log(error);
            res.render('error', { message: 'Child not found.' });
        } else {
            db.query(queryRapot, [anakId], (rapotError, rapotData) => {
                if (rapotError) {
                    console.log(rapotError);
                    res.render('error', { message: 'Error retrieving rapot data.' });
                } else {
                    res.render('anakDetails', { anak: anakData[0], rapotList: rapotData });
                }
            });
        }
    });
});



module.exports = router;