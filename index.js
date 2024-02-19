const express = require('express');
const server = express();
const port = 8000;
const multer = require('multer');
const basicAuth = require('express-basic-auth');
const path = require('path');
const fs = require('fs');
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
        cb(null, path.join(__dirname, 'public', 'upload')); 
    },
    filename: (req, file, cb) => {
        cb(null, `${all}${file.originalname}`);
    },
});

const upload = multer({ storage });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.post('/upload', upload.single('image'), (req, res) => {
    res.end(`File is uploaded`);
});

server.get('/set', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.get('/', (req, res) => {
    try {
        const path = 'public/upload';

        fs.readdir(path, (err, items) => {
            const responseData = {
                result: 'success',
                data: {
                    files: items
                }
            };

            // JSON.stringify 마지막 인자는 들여쓰기 개수임.
            const jsonOutput = JSON.stringify(responseData, null, 2);

            res.setHeader('Content-Type', 'application/json');
            res.send(jsonOutput);
        });
    } catch (error) {
        res.json({
            result: 'error',
            message: error.message
        });
    }
});


module.exports = server;