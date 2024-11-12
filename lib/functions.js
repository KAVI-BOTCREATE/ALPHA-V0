const axios = require('axios');

const getBuffer = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
        return res.data;
        };

        module.exports = { getBuffer };