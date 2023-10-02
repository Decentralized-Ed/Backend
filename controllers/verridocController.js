const fs = require('fs')
const processPDF = require('../utils/processPdf')
const { generateQr } = require('../services/verridocService')
const { uploadPDFToS3 } = require('../services/s3Service')

const uploadDoc = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path)
    const qrResp = await generateQr()
    console.log('qrdata ', qrResp)
    const qrCodeBase64 = qrResp.qrimage
    // console.log('qrcode64', qrCodeBase64)
    const modifiedpdfBuffer = await processPDF(pdfBuffer, qrCodeBase64)
    const bucketName = 'verridoc'
    const timestamp = new Date().getTime()
    const s3ObjectName = `${timestamp}.pdf`

    await uploadPDFToS3(bucketName, s3ObjectName, modifiedpdfBuffer)
      .then((fileURL) => {
        console.log('Uploaded PDF file URL:', fileURL)
        const uploadedFileURL = fileURL
        res.status(200).json({ fileURL: uploadedFileURL })
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error)
        res.status(500).json({ error: 'Failed to upload PDF' })
      })

    // res
    //   .status(200)
    //   .json({ message: 'PDF processed and uploaded to S3 successfully.' })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Failed to process the PDF.' })
  }
}

module.exports = {
  uploadDoc,
}
