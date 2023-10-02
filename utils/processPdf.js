const { PDFDocument } = require('pdf-lib')

const processPDF = async (pdfBuffer, qrCodeBase64) => {
  try {
    const qrbuffer = Buffer.from(qrCodeBase64, 'base64')
    const pdfImgDoc = await PDFDocument.create()
    pdfImgDoc.addPage([600, 400])
    const qrCodeImage = await pdfImgDoc.embedPng(qrbuffer)
    console.log(qrCodeImage)
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const page = pdfDoc.getPages()[0]
    const { width, height } = page.getSize()
    page.drawImage(qrCodeImage, {
      x: width - 100,
      y: height - 100,
      width: 80,
      height: 80,
    })

    const modifiedPdfBuffer = await pdfDoc.save()
    console.log(modifiedPdfBuffer, 'modified')

    return modifiedPdfBuffer
  } catch (error) {
    console.error('Error processing PDF:', error.message)
    throw error
  }
}

module.exports = processPDF
