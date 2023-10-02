const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/upload-doc', upload.single('pdf'), )

module.exports = router
