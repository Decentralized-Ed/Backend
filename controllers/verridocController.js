const fs = require('fs')
const processPDF = require('../utils/processPdf')
const { generateQr, submitDocument } = require('../services/verridocService')
const { uploadPDFToS3 } = require('../services/s3Service')

const uploadDoc = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path)
    const qrResp = await generateQr()
    // console.log('qrdata ', qrResp)
    const qrCodeBase64 = qrResp.qrimage
    const uniqueId = qrResp.uniqueId
    // console.log('qrcode64', qrCodeBase64)
    const modifiedpdfBuffer = await processPDF(pdfBuffer, qrCodeBase64)
    const bucketName = 'verridoc'
    const timestamp = new Date().getTime()
    const s3ObjectName = `${timestamp}.pdf`
    let uploadedFileUrl

    await uploadPDFToS3(bucketName, s3ObjectName, modifiedpdfBuffer)
      .then((fileURL) => {
        console.log('Uploaded PDF file URL:', fileURL)
        uploadedFileUrl = fileURL
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error)
        res.status(500).json({ error: 'Failed to upload PDF' })
      })

    const submitResp = await submitDocument(uniqueId, uploadedFileUrl)
    console.log(submitResp)

    res.status(200).json({
      message:
        'PDF processed, uploaded to S3 and submitted to Verridoc successfully.',
      data: submitResp,
    })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Failed to process the PDF.' })
  }
}

module.exports = {
  uploadDoc,
}
