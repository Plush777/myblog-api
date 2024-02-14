const express = require('express');
const server = express();
const bs = require('browser-sync').create();
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
server.use(express.static(__dirname));

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
    // Browsersync
    bs.init({
        proxy: `http://localhost:${port}`,
        port: 8080,
        ui: false, 
        files: ['*.js','views/*.html'], // 감시할 파일 확장자
        browser: 'chrome',
        notify: true, // 브라우저 알림 
        online: false, // 오프라인 상태 감지 
        open: false, // 브라우저 자동 오픈  
    });
});

server.post('/upload', upload.single('image'), (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.sendFile(__dirname + '/views/upload.html');
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
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.sendFile(__dirname + '/views/index.html');
});

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end('<a href="/api">API</a>');
});

module.exports = server;