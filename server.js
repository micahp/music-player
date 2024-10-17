const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const bucketName = 'gppls-daily';
const audioFolderPath = 'songs/';
const imageFolderPath = 'images/';

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cors());

// Endpoint to list audio files
app.get('/audio-files', (req, res) => {
    console.log('get : ', req.url);
    const params = {
        Bucket: bucketName,
        Prefix: audioFolderPath
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing audio files:', err);
            res.status(500).send('Error reading the S3 bucket');
            return;
        }
        const audioFiles = data.Contents
            .map(obj => obj.Key.replace(audioFolderPath, ''))
            .filter(file => /\.(mp3|wav)$/i.test(file));
        
        console.log('audio files found: ', audioFiles);
        res.json(audioFiles);
    });
});

// Endpoint to list image files
app.get('/image-files', (req, res) => {
    console.log('get : ', req.url);
    const params = {
        Bucket: bucketName,
        Prefix: imageFolderPath
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing image files:', err);
            res.status(500).send('Error reading the S3 bucket');
            return;
        }
        const imageFiles = data.Contents
            .map(obj => obj.Key.replace(imageFolderPath, ''));
        
        console.log('image files found: ', imageFiles);
        res.json(imageFiles);
    });
});

// Endpoint to serve audio files
app.get('/audio/:filename', (req, res) => {
    const params = {
        Bucket: bucketName,
        Key: `${audioFolderPath}${req.params.filename}`
    };
    
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error getting audio file:', err);
            res.status(404).send('Audio file not found');
            return;
        }
        res.setHeader('Content-Type', data.ContentType);
        res.send(data.Body);
    });
});

// Endpoint to serve image files
app.get('/images/:filename', (req, res) => {
    const params = {
        Bucket: bucketName,
        Key: `${imageFolderPath}${req.params.filename}`
    };
    
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error getting image file:', err);
            res.status(404).send('Image file not found');
            return;
        }
        res.setHeader('Content-Type', data.ContentType);
        res.send(data.Body);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
