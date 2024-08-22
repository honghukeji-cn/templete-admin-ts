import { message } from "antd";
require('isomorphic-fetch');
const API_URL=process.env.REACT_APP_API_URL;
const request = (url: string, config: any) => {
    url=API_URL+url;
    return fetch(url, config)
        .then((res: any) => {
            if (!res.ok) {
                // 服务器异常返回  
                throw Error('接口请求异常');
            }
            return res.json();
        })
        .then((data: any) => {
            if (data.code === 999) {
                if (localStorage.getItem('honghuToken')) {
                    localStorage.removeItem('honghuToken')
                }
                message.error(data.msg, 1, () => {
                    window.location.href = ''
                })
                return data;
            }
            return data;
        })
        .catch((error: any) => {
            return Promise.reject(error);
        });
};

// GET请求
export const get = (url: string) => {
    return request(url, { method: 'GET' });
};

// POST请求
export const post = (url: string, data: any) => {
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;',
            "Accept": "application/json",
            'token': localStorage.getItem('honghuToken') || ""
        },
        body: JSON.stringify(data),
    });
};