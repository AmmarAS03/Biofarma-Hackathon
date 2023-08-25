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

router.get('/imunisasiObatC', (req, res) => {
    res.render('imunisasiObatC');
});

// routes/pages.js
router.post('/submitImunisasi', (req, res) => {
    const { nisn, tanggal_tindakan, kode_obat, reaksi_24_jam, reaksi_72_jam, reaksi_1_minggu, efek_samping } = req.body;

    const nama_kegiatan = 'Imunisasi Obat C';

    // Check if the provided nisn exists in the anak table
    const checkNisnQuery = 'SELECT COUNT(*) AS count FROM anak WHERE nisn = ?';

    db.query(checkNisnQuery, [nisn], (checkError, checkResult) => {
        if (checkError) {
            console.log(checkError);
            // Handle the error, e.g., show an error page
            res.render('imunisasiObatC', { message: 'Error checking nisn.' });
        } else {
            const count = checkResult[0].count;
            if (count === 0) {
                // nisn not found, handle accordingly (e.g., show a message)
                res.render('imunisasiObatC', { message: 'NISN yang anda masukan salah' });
            } else {
                // Construct the INSERT query
                const insertQuery = 'INSERT INTO rapot (anak_id, tanggal_tindakan, nama_kegiatan, kode_obat, reaksi_24_jam, reaksi_72_jam, reaksi_1_minggu, efek_samping) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                
                // Execute the INSERT query
                db.query(insertQuery, [nisn, tanggal_tindakan, nama_kegiatan, kode_obat, reaksi_24_jam, reaksi_72_jam, reaksi_1_minggu, efek_samping], (error, result) => {
                    if (error) {
                        console.log(error);
                        // Handle the error, e.g., show an error page
                        res.render('imunisasiObatC', { message: 'Error submitting data.' });
                    } else {
                        // Successful insertion
                        res.render('imunisasiObatC', { message: `${nisn} berhasil dimasukan` }); // Redirect back to the form page
                    }
                });
            }
        }
    });
});




module.exports = router;