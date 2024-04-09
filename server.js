const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;
const audioFolderPath = process.env.MUSIC_PATH; // Update with your folder path

console.log('using file path: ', audioFolderPath);

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use('/audio', express.static(audioFolderPath));
app.use(cors());

// Endpoint to list audio files
app.get('/audio-files', (req, res) => {
    console.log('get : ', req.url);
    fs.readdir(audioFolderPath, (err, files) => {
        if (err) {
            res.status(500).send('Error reading the directory');
            return;
        }
        console.log('audio files found: ', files);

        const audioFiles = files.filter(file => file.endsWith('.mp3')); // Filter for .mp3 files, modify as needed
        res.json(audioFiles);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
