const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multerImageUpload = require('./utils/multerImageUpload');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


const app = express();

const upload = multerImageUpload.multerImageUpload();


app.use(bodyParser.json());
app.use( upload.single('image') );

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/feed', feedRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const errorData = error.data;
    res.status(status).json({ message: message, errorData: errorData});
});


mongoose
    .connect(
        `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-aro5a2z-shard-00-00.fpjtbus.mongodb.net:27017,ac-aro5a2z-shard-00-01.fpjtbus.mongodb.net:27017,ac-aro5a2z-shard-00-02.fpjtbus.mongodb.net:27017/${process.env.MONGO_DATABASE}?replicaSet=atlas-144o5k-shard-0&ssl=true&authSource=admin`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((result) => {
        console.log('connected to db');
        app.listen(process.env.NODE_ENV || 8080);
    })
    .catch((err) => console.log(err));
