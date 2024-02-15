const express = require('express');
const server = express();
const port = 8000;
const multer = require('multer');
const basicAuth = require('express-basic-auth');
const path = require('path');
const upload = multer({ dest: '/tmp' });
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

const uploadStorage = multer({ storage });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.post('/upload', uploadStorage.single('image'), async (req, res) => {
    // res.end('File is uploaded');
    try {
        // Move the uploaded file to a public directory (accessible after deployment)
        const destinationPath = path.join(__dirname, 'public', 'upload', req.file.originalname);
        await fs.rename(req.file.path, destinationPath);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.get('/set', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.get('/', (req, res) => {
    const fs = require('fs');
    const path = 'public/upload';

    fs.readdir(path, (err, items) => {
        res.json(items);
    });
});

module.exports = server;