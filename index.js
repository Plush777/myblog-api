const app = require('express')();
const port = 9999;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.end(`<a href="/api">/api</a>`);
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

module.exports = app;