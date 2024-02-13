require('dotenv').config();
const express = require('express');
const app = express();
const imageRouter = require('./routes/image.router.js');
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');

/** ---------- MIDDLEWARE ---------- **/
// Accept file uploads
app.use(fileUpload());

// needed for req.body
app.use(express.json());
app.use(express.static('build'));

/** ---------- EXPRESS ROUTES ---------- **/
app.use('/api/images', imageRouter);

/** ---------- START SERVER ---------- **/
app.listen(PORT,  () => {
    console.log('Listening on port: ', PORT);
});