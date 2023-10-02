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

module.exports = {
  generateQr,
}
