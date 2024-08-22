import React, {forwardRef, useEffect, useRef, useState} from "react";
import FileList from "./FileList";
import {Upload, UploadFile} from "antd";

interface UploadImgProps {
    value?: string[];//图片集
    multiple?:boolean;//是否允许多传
    max?:number;//最大上传数量
    onChange?: (value: string[]) => void;//change回调
}
const UploadImg= (props:UploadImgProps) => {
    console.log(props)
    const fileRef: any = useRef(null);
    const [fileList,setFileList]=useState<any>([]);
    const triggerChange = () => {
        var url=[];
        for(var i=0;i<fileList.length;i++)
        {
            url.push(fileList[i].url)
        }
        props.onChange?.(url);
    };
    useEffect(()=>{
        triggerChange()
    },[fileList])
    useEffect(()=>{
        makeFileList(props.value||[])
    },[])
    const makeFileList=(files:string[])=>{
        var arr=[];
        for(var i=0;i<fileList.length;i++)
        {
            arr.push(fileList[i].url)
        }
        files=arr.concat(files);
        let list=[];
        for(var i=0;i<files.length;i++)
        {

           list.push({
               "uid": "rc-upload-1723036399224-9"+i,
               "name": "图片"+(i+1),
               url:files[i],
               thumbUrl:files[i],
               status:"done"
           });
        }
        setFileList(list);
    }

    return (
        <React.Fragment>
            <Upload
                fileList={fileList}

                listType={"picture-card"}
                onChange={(e)=>{
                    setFileList(e.fileList)
                }}>
                {((props.multiple==true && ((props.max && props.max>fileList.length) || !props.max)) || (!props.multiple && fileList.length==0)) &&
                    <img alt='' onClick={(e)=>{
                        fileRef.current.refresh();
                        e.stopPropagation()
                    }} src={require("../static/img.png")} className="addImgBtn cursor" />
                }
            </Upload>
            {/* 文件库 */}
            <FileList ref={fileRef} max={props.max} type={1} multiple={props.multiple} onOk={(data: string[]) => {
                makeFileList(data);
            }} />
        </React.Fragment>
    )
}
export default forwardRef(UploadImg);