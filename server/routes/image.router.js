const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

router.get('/', async (req, res) => {
    try {
        let result = await pool.query(`
            SELECT * FROM "images";
        `);
        res.send(result.rows);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

/**
 * For private buckets, you will need to request the image
 * through your server.
 */
router.get('/:imageName', async (req, res) => {
    try {
        const { imageName } = req.params;
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: `images/${imageName}`, // folder/file 
        });
        const data = await s3Client.send(command);
        data.Body.pipe(res);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const { imageName, imageType } = req.query;
        const imageData = req.files.image.data;
        const imageKey = `images/${imageName}`; // folder/file
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: imageKey, // folder/file 
            Body: imageData, // image data to upload
        });

        const response = await s3Client.send(command);
        console.log(response); // Used for debugging
        await pool.query(`
            INSERT INTO "images" ("name", "type")
            VALUES ($1, $2);
        `, [imageName, imageType]);

        // Send OK back to client
        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

module.exports = router;
