const express = require('express');
const app = express();
const bs = require('browser-sync').create();
const port = 8000;
const cors = require('cors');
const multer = require('multer');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const users = {
    [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD
}

app.use(basicAuth({
    users,
    challenge: true,
}));
app.use(cors());
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${year}_${month}_${date}_${file.originalname}`);
    },
});

const upload = multer({ storage });

app.listen(port, () => {
    // Browsersync
    bs.init({
        proxy: `http://localhost:${port}`,
        port: 8080,
        ui: false, 
        files: ['app.js','views/*.ejs'], // 감시할 파일 확장자
        browser: 'chrome',
        notify: true, // 브라우저 알림 
        online: false, // 오프라인 상태 감지 
        open: false, // 브라우저 자동 오픈  
    });
});

app.get('public/images/:imageName', (req, res) => {
    res.sendFile(`${__dirname}/public/images/${req.params.imageName}`);
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.render('upload.ejs', { filename: req.file.originalname });
});

app.get('/', (req, res) => {
    const production = process.env.NODE_ENV === 'production';

    res.render('index.ejs', { production });
});

app.get('/api', (req, res) => {
    const fs = require('fs');
    const path = './upload';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    fs.readdir(path, (err, items) => {
        res.json(items);
    });
});


module.exports = (req, res) => {
    app(req, res);
};