import axios from 'axios';

function fetch<T>(url: string): Promise<T> {
    return new Promise(function (resolve, reject) {
        const isValidUrl = url.startsWith('https');
        if (isValidUrl) {
            axios.get(url).then(function (res) {
                resolve(res.data as T);
            }).catch(function (err) {
                reject(err);
            });
        }
    });
}

export default fetch;
