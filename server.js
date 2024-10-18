[200~const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;
const audioFolderPath = process.env.MUSIC_PATH; // Update with your folder path
const imageFolderPath = process.env.IMAGE_PATH; // Update with your folder path

console.log('using file path: ', audioFolderPath);

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use('/audio', express.static(audioFolderPath));
app.use('/images', express.static(imageFolderPath));
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

        const audioFiles = files.filter(file => /\.(mp3|wav)$/i.test(file)); // Filter for .mp3 or .wav files (case-insensitive)
        res.json(audioFiles);
    });
});

// endpoint to list image files
app.get('/image-files', (req, res) => {
    console.log('get : ', req.url);
    fs.readdir(imageFolderPath, (err, files) => {
        if (err) {
            res.status(500).send('Error reading the directory');
            return;
        }
        console.log('image files found: ', files);
        res.json(files);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
