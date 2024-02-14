const express = require('express');
const server = express();
const port = 8000;
const multer = require('multer');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const users = {
    [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD
}

server.use(basicAuth({
    users,
    challenge: true,
}));
server.use(express.static("public"));

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();

const all = `${year}_${month}_${date}_`;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${all}${file.originalname}`);
    },
});

const upload = multer({ storage });

const fs = require('fs');

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.post('/upload', upload.single('image'), (req, res) => {
    res.end('File is uploaded');
});

server.get('/api', (req, res) => {
    const path = './upload';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    fs.readdir(path, (err, items) => {
        res.json(items);
    });
});

server.get('/set', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end('<a href="/api">/api</a>');
});

module.exports = server;