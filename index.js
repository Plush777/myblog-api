const express = require('express');
const server = express();
const port = 8000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuidAPIkey = require('uuid-apikey');
require('dotenv').config();

// console.log(process.env);
server.use(express.static("public"));

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();

const all = `${year}_${month}_${date}_`;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'upload/image')); 
    },
    filename: (req, file, cb) => {
        cb(null, `${all}${file.originalname}`);
    },
});

const upload = multer({ storage });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.post('/upload/image', upload.single('image'), (req, res) => {
    res.end(`File is uploaded`);
});

//uuid apikey 라이브러리로 요청을 받았을 때 랜덤 키 발급.
let key;

server.post('/api/key', (req, res) => {
    key = uuidAPIkey.create();

    res.json({
        apiKey: key.apiKey,
        uuid: key.uuid 
    });
});  

const getSet = () => {
    server.get('/set', (req, res) => {
        res.sendFile('index.html', {root: path.join(__dirname, 'public')});
    }); 
}

if (process.env.STATE == 'dev') { 
    getSet();
} else { 
    res.send('해당 도메인에서는 접근할 수 없습니다.');
}

server.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

/**
    * @param {string} paramPath - 가져오고싶은 파일 경로
    * @param {Object} paramRes - server response 객체
*/

const getResource = (paramPath, paramRes) => {
    const path = paramPath;

    fs.readdir(path, (err, items) => {
        const responseData = {
            data: {
                files: items
            }
        }

        // JSON.stringify 마지막 인자는 들여쓰기 개수임.
        const jsonOutput = JSON.stringify(responseData, null, 2);

        paramRes.setHeader('Content-Type', 'application/json');
        paramRes.send(jsonOutput);
    });
}

server.get('/api/:apiKey/:resource', (req, res) => {
    let { apiKey, resource } = req.params;

    // https://www.npmjs.com/package/uuid-apikey
    if (!uuidAPIkey.isAPIKey(apiKey) || !uuidAPIkey.check(apiKey, key.uuid)) {
        res.send('API키가 아니거나 검증되지 않은 API key입니다.');
    } else {
        if (resource === 'image') {
            getResource('public/upload/image', res);
        } else {
            res.send('잘못된 리소스 요청입니다.');
        }
    }
});

module.exports = server;