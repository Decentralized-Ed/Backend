const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
var base64Img = require('base64-img')

const processPDF = async (pdfBuffer, qrCodeBase64) => {
  try {
    //  base64Img.img(qrCodeBase64, '', '1', function (err, filepath) {})
    const base64Data = qrCodeBase64.replace(/^data:image\/\w+;base64,/, '')
    const qrbuffer = Buffer.from(base64Data, 'base64')

    const pdfDoc = await PDFDocument.load(pdfBuffer)

    const [page] = pdfDoc.getPages()
    const width = 400
    const height = 400

    const pngImage = await pdfDoc.embedPng(qrbuffer)

    page.drawImage(pngImage, {
      x: width - 10,
      y: 10,
      width: 80,
      height: 80,
    })

    const modifiedPdfBuffer = await pdfDoc.save()

    // const filePath = 'output_file4.pdf'

    // fs.writeFile(filePath, modifiedPdfBuffer, (err) => {
    //   if (err) {
    //     console.error('Error saving the file:', err)
    //   } else {
    //     console.log(`File saved to ${filePath}`)
    //   }
    // })

    // console.log(modifiedPdfBuffer, 'modified')

    return modifiedPdfBuffer
  } catch (error) {
    console.error('Error processing PDF:', error.message)
    throw error
  }
}

module.exports = processPDF
