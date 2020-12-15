// step 1: load required libraries and modules
const express = require('express');
// const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql2/promise');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// import the mongodb driver
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

// connection string
const MONGO_URL = "mongodb://localhost:27017";

// create an instance of the Mongodb Client
const mongoClient = new MongoClient(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// step 2: configure PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// step 3: create an instance of the express server
const app = express();

// step 4: create a pool where data connection to the DB can be made
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME || 'northwind',
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT) || 4,
    timezone: '+08:00'
});

// step 5: create start function to ensure that a DB connection can be established
const startApp = async (newApp, newPool) => {
    // we do not know if a connection can be made at this moment, so we start with a try statement
    try {
        const conn = await newPool.getConnection();

        console.info('We are pinging the database..');
        await conn.ping();

        // at this point, if an error is not thrown, a connection to the DB can be established
        conn.release();

        mongoClient.connect().then(() => {
            newApp.listen(PORT, () => {
                console.info(`Server started at port ${PORT} on ${new Date()}`);
            });
        }).catch(e => {
            console.error('=> Unable to establish a connection to the MongoDB server:', e);
        });
    } catch (e) {
        console.error('=> Unable to establish connection to DB: ', e);
    }
};

// step 6: define the SQL Queries or cloud persistance storage
// define any SQL Queries for a DB
const makeQuery = (sql, dbPool) => {
    console.info('=> Creating query: ', sql);
    return (async (args) => {
        const conn = await dbPool.getConnection();
        try {
            let results = await conn.query(sql, args) || [];
            return results[0];
        } catch (e) {
            console.error(e);
        } finally {
            conn.release();
        }
    });
};

// define any cloud persistance storage settings
const multipart = multer({
    dest: path.join(__dirname, "/uploads/")
});
/* we are practicing MongoDB, so there is no need for S3-compatible cloud storage
const cloudEP = process.env.CLOUD_ENDPOINT;
const endpoint = new AWS.Endpoint(cloudEP);
const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
}); */

// step 7: define any middleware and routes to handle
// app.use(cors()); // we will be using proxy, so cross-origin data calls are not needed
app.use(morgan('combined'));

// GET /countries
app.get('/api/countries', (req, res, next) => {
    mongoClient.db('winemag').collection('wine')
        .distinct('country')
        .then(result => {
            console.info('=> distinct countries: ', result);
            res.status(200).contentType('application/json').json(result);
        }).catch(e => {
            console.error('=> Error querying MongoDB: ', e);
            res.status(500).contentType('application/json').json({error: e});
        });
});

// GET /country/:country
app.get('/api/country/:country', (req, res, next) => {
    const country = req.params['country'];
    const offset = parseInt(req.query['offset']) || 0;
    const limit = parseInt(req.query['limit']) || 30;
    console.info(`=> in country route with Country: ${country}, Offset: ${offset}, Limit: ${limit}`);

    mongoClient.db('winemag').collection('wine')
        .find({ country: {
            $regex: country,
            $options: 'i'
        } })
        .sort({ province: 1 })
        .project({ title:1, price:1 })
        .skip(offset)
        .limit(limit)
        .toArray()
        .then(result => {
            res.status(200).contentType('application/json').json(result);
        }).catch(e => {
            console.error('=> Error querying MongoDB: ', e);
            res.status(500).contentType('application/json').json({error: e});
        });
});

app.get('/api/wine/:id', (req, res, next) => {
    const _id = req.params['id'];
    console.info('=> In /api/wine with id: ', _id.toString());

    mongoClient.db('winemag').collection('wine')
        .find({ _id: ObjectId(_id.toString()) })
        .toArray()
        .then(result => {
            res.status(200).contentType('application/json').json(result);
        }).catch(e => {
            console.error('=> Error getting wine from id: ', e);
            res.status(500).contentType('application/json').json({error: e});
        });
});

app.use(express.static(__dirname + "/public"));

// step 8: start the server
startApp(app, pool);
