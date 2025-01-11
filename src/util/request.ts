import { message } from "antd";
require('isomorphic-fetch');
interface HttpResponse{
    code:number;//状态码 1成功 0失败
    msg?:string;//错误信息
    data:any;//数据包
}
type Method="POST" | "GET" | "OPTIONS" | "DELETE" | "HEAD" | "PUT" | "PATCH";

const API_URL=process.env.REACT_APP_API_URL;
const requestFormData = (url:string,data:any,method:Method) => {
    url=API_URL+url;
    return new Promise<HttpResponse>((resolve)=>{
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;',
                "Accept": "application/json",
                'token': localStorage.getItem('honghuToken') || ""
            },
            body: JSON.stringify(data),
        }).then((res) => {
                if (!res.ok) {
                    // 服务器异常返回
                    throw Error('接口请求异常');
                }
                res.json().then((data:HttpResponse)=>{
                    if (data.code === 999) {
                        if (localStorage.getItem('honghuToken')) {
                            localStorage.removeItem('honghuToken')
                        }
                        message.error(data.msg, 1, () => {
                            window.location.href = ''
                        })
                        return;
                    }
                    //没有操作权限
                    if(data.code==888)
                    {
                        message.error(data.msg);
                        data.code=0;
                    }
                    resolve(data);
                });
            }).catch((error) => {
                let result:HttpResponse={
                    code:0,
                    msg:error.errMsg,
                    data:[]
                }
                resolve(result)
            });
    })
};
const requestBlob= (url:string,data:any,method:Method) => {
    url=API_URL+url;
    return new Promise<HttpResponse | Blob>((resolve)=>{
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;',
                "Accept": "application/json",
                'token': localStorage.getItem('honghuToken') || ""
            },
            body: JSON.stringify(data),
        }).then((res) => {
            if (!res.ok) {
                // 服务器异常返回
                throw Error('接口请求异常');
            }
            const contentType = res.headers.get('Content-Type');
            if(contentType=="application/json")
            {
                res.json().then((data:HttpResponse)=>{
                    if (data.code === 999) {
                        if (localStorage.getItem('honghuToken')) {
                            localStorage.removeItem('honghuToken')
                        }
                        message.error(data.msg, 1, () => {
                            window.location.href = ''
                        })
                        return;
                    }
                    //没有操作权限
                    if(data.code==888)
                    {
                        message.error(data.msg);
                        data.code=0;
                    }
                    resolve(data);
                });
            }else{
                res.blob().then((data:Blob)=>{
                    resolve(data);
                })
            }
        })
            .catch((error) => {
                let result:HttpResponse={
                    code:0,
                    msg:error.errMsg,
                    data:[]
                }
                resolve(result)
            });
    })
};
export  default  class Request{
    static POST(url:string,data:any):Promise<HttpResponse>{
        return requestFormData(url,data,"POST")
    }
    static GET(url:string):Promise<HttpResponse>
    {
        return requestFormData(url,{},"GET");
    }
    static DowanLoad(url:string,data:any):Promise<HttpResponse | Blob>
    {
        return requestBlob(url,data,"POST");
    }
}