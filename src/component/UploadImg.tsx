import React, {forwardRef, useEffect, useRef, useState} from "react";
import FileList from "./FileList";
import {Button, Upload, UploadFile} from "antd";
import Helper from "../util/Helper";

interface UploadImgProps {
    value?: any[];//图片集
    multiple?:boolean;//是否允许多传
    max?:number;//最大上传数量
    onChange?: (value: string[]) => void;//change回调
}
const UploadImg= (props:UploadImgProps) => {
    console.log(props)
    const fileRef: any = useRef(null);
    const triggerChange = (files:any) => {

        props.onChange?.(files);
    };

    const makeFileList=(files:string[])=>{
        var arr=[];
        var fileList=props.value || [];
        for(var i=0;i<fileList.length;i++)
        {
            arr.push(fileList[i].url)
        }
        files=arr.concat(files);
        triggerChange(Helper.str2fileList(files.join(",")))
    }

    return (
        <React.Fragment>
            {props.value && props.value.length>0 ?
                <Upload
                    fileList={props.value}

                    listType={"picture-card"}
                    onChange={(e)=>{
                        triggerChange(e.fileList);
                    }}>
                    {((props.multiple==true && ((props.max && props.max>props.value.length) || !props.max)) || (!props.multiple && props.value.length==0)) &&
                    <img alt='' onClick={(e)=>{
                        fileRef.current.refresh();
                        e.stopPropagation()
                    }} src={require("../static/img.png")} className="addImgBtn cursor" />
                    }
                </Upload>
                :
                <img alt='' onClick={(e)=>{
                    fileRef.current.refresh();
                    e.stopPropagation()
                }} src={require("../static/img.png")} className="addImgBtn cursor" />
            }

            {/* 文件库 */}
            <FileList ref={fileRef} max={props.max} type={1} multiple={props.multiple} onOk={(data: string[]) => {
                makeFileList(data);
            }} />
        </React.Fragment>
    )
}
export default forwardRef(UploadImg);