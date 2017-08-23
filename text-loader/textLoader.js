const request = require('request');
const fs = require('fs');
const path = require('path');

const sourceDir = [
    '../doc/texts/bbc/business',
    '../doc/texts/bbc/entertainment',
    '../doc/texts/bbc/politics',
    '../doc/texts/bbc/sport',
    '../doc/texts/bbc/tech',
];

sourceDir.forEach((dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error(err);
        }

        files.forEach((file) => {
            fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
                const lines = data.split('\n');
                const title = lines.splice(0, 1)[0];
                const text = lines.join('\n');

                request.post('http://localhost:4100/api/texts', {
                    json: {
                        title: title,
                        text: text
                    }
                }, (err, response, body) => {
                    if (err) {
                        return console.error(err);
                    }

                    if (!err && response.statusCode == 200) {
                        console.log(body)
                    }
                })
            });
        });
    });
});