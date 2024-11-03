import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Select, SelectProps} from 'antd';
import * as req from '../util/request';
type SelectType = 'allrole' | 'alladmin';
interface CusotmerSelectProps extends SelectProps{
    type:SelectType;

}
const CustomerSelect=(props:CusotmerSelectProps,ref:any)=>{
    const [options,setOptions]=useState<any>([]);
    const [url,setUrl]=useState<string>("")
    useEffect(()=>{
        if(props.type=="allrole")
        {
            setUrl("admin/getSearchRoleList")
        }else if(props.type=="alladmin")
        {
            setUrl("admin/getSearchAdminList")
        }
    },[])
    useEffect(()=>{
       if(url!="")
       {
           req.post(url, {}).then((res:any) => {
               if (res.code === 1) {
                   setOptions(res.data)
               }
           })
       }
    },[url])

    return(
        <Select
            placeholder='请选择'
            suffixIcon={(<span className='iconfont icon-xia'></span>)}
            allowClear
            {...props}
            className={`pubSelt ${props.className}`}
            options={options}
        />
    );
}

export default forwardRef(CustomerSelect);