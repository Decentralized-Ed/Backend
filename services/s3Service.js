const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

function uploadPDFToS3(bucketName, s3ObjectName, pdfBuffer) {
//   console.log(s3)
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: s3ObjectName,
      Body: pdfBuffer,
      ACL: 'public-read',
    }

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err)
        reject(err)
      } else {
        console.log(
          'Modified PDF File uploaded to S3 successfully. File URL:',
          data.Location
        )
        resolve(data.Location)
      }
    })
  })
}

module.exports = {
  uploadPDFToS3,
}
