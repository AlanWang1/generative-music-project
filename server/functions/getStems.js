const axios = require('axios')

 const getStems = (key, inputUrl) => {
    var options = {
        method: 'POST',
        url: 'https://developer.moises.ai/api/media',
        headers: {Authorization: key, 'Content-Type': 'application/json'},
        data: {
          inputUrl: inputUrl,
          operations: [{type: 'STEMS', mode: 'vocals-drums-bass-other'}]
        }
    };

    return axios.request(options)

}

module.exports = {getStems}