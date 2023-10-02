const { PDFDocument } = require('pdf-lib')

const processPDF = async (pdfBuffer, qrCodeBase64) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const qrCodeImage = await pdfDoc.embedPng(
      Buffer.from(qrCodeBase64, 'base64')
    )
    const page = pdfDoc.getPages()[0]
    const { width, height } = page.getSize()
    page.drawImage(qrCodeImage, {
      x: width - 100,
      y: height - 100,
      width: 80,
      height: 80,
    })

    const modifiedPdfBuffer = await pdfDoc.save()

    return modifiedPdfBuffer
  } catch (error) {
    console.error('Error processing PDF:', error.message)
    throw error
  }
}

module.exports = processPDF
