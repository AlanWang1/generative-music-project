
const axios = require('axios')

 const requestUploadUrl = (key) => {
  let options = {
    method: 'GET',
    url: 'https://developer.moises.ai/api/upload/signed-url',
    headers: {
      Authorization: key,
      'Accept-Encoding': 'null'
    }
  };
  
  return axios(options)
}

module.exports = {requestUploadUrl}
