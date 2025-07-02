const express = require('express');
const multer = require('multer');
const { uploadCsv } = require('../controllers/csvController');
const router = express.Router();

const upload = multer({ dest: 'src/uploads/' });

router.post('/upload', upload.single('file'), uploadCsv);

module.exports = router;
