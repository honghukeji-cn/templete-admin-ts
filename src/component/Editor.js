import React, { createRef } from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'
import FileList from './FileList';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'

const options = {
    defaultColumns: 4, // 默认列数
    defaultRows: 5, // 默认行数
    withDropdown: true, // 插入表格前是否弹出下拉菜单
    columnResizable: true, // 是否允许拖动调整列宽，默认false
    exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};
BraftEditor.use(Table(options));
export default class Ueditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(props.value || null),
            fullControls: [
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
            ],
            controls: [{
                key: "fullscreen",
                title: "开启全屏以使用更多功能"
            }, 'bold', 'italic', 'text-color'],
            isFullscreen: false
        }
        this.fileRef = createRef(null)
    }
    uploadHandler = (url) => {
        const editorState = ContentUtils.insertMedias(this.state.editorState, [{
            type: 'IMAGE',
            url: url
        }]);
        this.setState({
            editorState
        }, () => {
            this.triggerChange(editorState)
        })
    }
    getContent() {
        return this.state.editorState.toHTML();
    }
    setContent(html) {
        this.setState({
            editorState: BraftEditor.createEditorState(html)
        })
    }
    // 通知form数据改变
    triggerChange = (value) => {
        this.props.onChange?.(value);
    };
    render() {
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <button type="button" className="control-item button upload-button" data-title="插入图片" onClick={() => {
                        this.fileRef.current.refresh();
                    }}>插入图片</button>
                )
            }
        ]
        return (
            <React.Fragment>
                <BraftEditor
                    className="no-drag myarea"
                    value={this.state.editorState}
                    controls={this.state.isFullscreen ? this.state.fullControls : this.state.controls}
                    extendControls={extendControls}
                    placeholder="全屏输入功能更佳"
                    onChange={(editorState) => {
                        this.setState({
                            editorState
                        }, () => {
                            this.triggerChange(editorState)
                        })
                    }}
                    onFullscreen={(e) => {
                        this.setState({
                            isFullscreen: e
                        })
                    }}
                />
                {/* 文件库 */}
                <FileList fileNum={1} ref={this.fileRef} type={1} onOk={this.onOk.bind(this)} />
            </React.Fragment>
        )
    }
    onOk(data) {
        this.uploadHandler(data[0])
    }
}