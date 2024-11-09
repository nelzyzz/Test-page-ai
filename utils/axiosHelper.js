// utils/axiosHelper.js
const axios = require('axios');

async function sendRequest(url, method, data = {}, token) {
    try {
        const response = await axios({
            method,
            url,
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            data,
        });
        return response.data;
    } catch (error) {
        console.error("Request Error:", error);
        throw error;
    }
}

module.exports = sendRequest;
