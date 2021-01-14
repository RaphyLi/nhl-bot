import axios from 'axios';

const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

function fetch(url: string) {
    return new Promise(function (resolve, reject) {
        const isValidUrl = url.startsWith('https');
        axios.get(url).then(function (res) {
            resolve(res)
        }).catch(function (err) {
            reject(err)
        });
    });
}

export default fetch;
