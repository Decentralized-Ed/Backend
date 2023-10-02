const express = require('express')
const router = express.Router()
const multer = require('multer')
const { uploadDoc } = require('../controllers/verridocController')
const upload = multer({ dest: 'uploads/' })

router.post('/upload-doc', upload.single('pdf'), uploadDoc)

module.exports = router
