import React, {forwardRef, useEffect, useRef, useState} from "react";
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'
import FileList from './FileList';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'


const Ueditor= (props) => {
    const fileRef = useRef(null);
    const [isFullscreen,setFullScreen]=useState(false);
    const [fullControls]=useState( [
        'fullscreen', 'undo', 'redo', 'separator',
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'superscript', 'subscript', 'remove-styles', 'emoji', 'separator',
        'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        'link', 'separator',
        'hr', 'separator',
        'table', 'separator',
        'clear', 'separator',
    ]);
    const [controls]=useState([{
        key: "fullscreen",
        title: "开启全屏以使用更多功能"
    }, 'bold', 'italic', 'text-color']);
    const [editorState,setEditorState]=useState(null);
    useEffect(()=>{
        console.log("更新",props.value)
        setEditorState(BraftEditor.createEditorState(props.value || ""));
    },[props.value])
    const onChooseFile=(imgs)=>{
        setEditorState(ContentUtils.insertMedias(editorState, [{
            type: 'IMAGE',
            url: imgs[0]
        }]));
    }
    return (
        <React.Fragment>
            <BraftEditor
                className="no-drag myarea"
                value={editorState}
                controls={isFullscreen ? fullControls : controls}
                extendControls={[
                    {
                        key: 'antd-uploader',
                        type: 'component',
                        component: (
                            <button type="button" className="control-item button upload-button" data-title="插入图片" onClick={() => {
                                fileRef.current.refresh();
                            }}>插入图片</button>
                        )
                    }
                ]}
                placeholder="全屏输入功能更佳"

                onBlur={(e)=>{
                    props.onChange(e.toHTML())
                }}
                onFullscreen={(e) => {
                    setFullScreen(e)
                }}
            />
            {/* 文件库 */}
            <FileList fileNum={1} ref={fileRef} type={1} onOk={onChooseFile} />
        </React.Fragment>
    )
}
export default forwardRef(Ueditor);