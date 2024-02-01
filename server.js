const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const audioFolderPath = process.env.MUSIC_PATH; // Update with your folder path

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use('/audio', express.static(audioFolderPath));

// Endpoint to list audio files
app.get('/audio-files', (req, res) => {
    fs.readdir(audioFolderPath, (err, files) => {
        if (err) {
            res.status(500).send('Error reading the directory');
            return;
        }

        const audioFiles = files.filter(file => file.endsWith('.mp3')); // Filter for .mp3 files, modify as needed
        res.json(audioFiles);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
