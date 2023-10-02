const axios = require('axios')
const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config()

const BASE_URL = 'https://my.veridocglobal.com/api'
const apikey = process.env.API_KEY
const apisecret = process.env.API_SECRET
const payload = calculateSHA256Hash(`${apikey}${apisecret}`)

function calculateSHA256Hash(data) {
  const hash = crypto.createHash('sha256')
  hash.update(data)
  const hashedData = hash.digest('hex')

  return hashedData
}

async function generateQr() {
  try {
    const response = await axios.post(
      `${BASE_URL}/generateqr`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: apikey,
          payload: payload,
        },
      }
    )

    return response.data
  } catch (error) {
    throw new Error(
      'Failed to send POST request to the external API: ' + error.message
    )
  }
}

async function submitDocument(docurl) {
  try {
    const reqbody = {
      uniqueId: '7f9f2b05-4cb7-4552-a1cb-88e2ba8889f6',
      fileurl:
        'https://drive.google.com/file/d/1Y_PMrGnwCQo3aYTZfEi_gu1yzGkasQH_/view',
      isfileurlpublic: '1',
      metadata:
        'Name: John Smith || Title: Test Analyst || Email: John.Smith@test.com',
      parent_delimiter: '||',
      child_delimiter: ':',
      Ispublic: '0 or 1',
      authorizedusers:
        'john.smith@abc.com; andrew.white@def.com; peter.wood@xyz.com',
      Redirecturl: 'yourwebsiteURL.com/verify',
      IsVerificationGatewayRequired: 'true or false',
      sendmetadatatoblockchain: 'true or false',
      metadataforblockchain:
        'Add any data string or UHV here to show in blockchain record',
      isparent: '0',
      parentid: 'dcdbfa3b-e883-4406-96c3-8cb0cd480c89',
    }
    const response = await axios.post(`${BASE_URL}/submitdocument`, reqbody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: apikey,
        payload: payload,
      },
    })

    return response.data
  } catch (error) {
    throw new Error(
      'Failed to send POST request to the external API: ' + error.message
    )
  }
}


module.exports = {
  generateQr,
}
