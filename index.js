const express = require('express');
const server = express();
const port = 8000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuidAPIkey = require('uuid-apikey');

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

//uuid apikey 라이브러리로 요청을 받았을 때 랜덤 키 발급.
const key = uuidAPIkey.create();

server.post('/api/key', (req, res) => {
    res.json({
        apiKey: key.apiKey,
        uuid: key.uuid
    });
});

server.get('/set', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.get('/api/image/:apiKey', (req, res) => {
    let { apiKey } = req.params;

    // https://www.npmjs.com/package/uuid-apikey
    if (!uuidAPIkey.isAPIKey(apiKey) || !uuidAPIkey.check(apiKey, key.uuid)) {
        res.send('API키가 아니거나 검증되지 않은 API key입니다.');
    } else {
        const path = 'public/upload';

        fs.readdir(path, (err, items) => {
            const responseData = {
                data: {
                    files: items
                }
            };

            // JSON.stringify 마지막 인자는 들여쓰기 개수임.
            const jsonOutput = JSON.stringify(responseData, null, 2);

            res.setHeader('Content-Type', 'application/json');
            res.send(jsonOutput);
        });
    }
});

module.exports = server;