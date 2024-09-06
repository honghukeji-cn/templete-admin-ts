import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState } from 'react';
import { App, Button, Form, Input, Select, Switch } from 'antd';
import FileList from '../../../component/FileList';
import Helper from '../../../util/Helper';
import Editor from '../../../component/Editor';
import * as req from '../../../util/request';
import UploadImg from "../../../component/UploadImg";
const typeList = [
    { value: 1, label: '文本' },
    { value: 2, label: '数字' },
    { value: 3, label: '图片' },
    { value: 4, label: '图文' },
    { value: 5, label: '开/关' },
]
const Index = (_props: any, ref: any) => {
    const formRef: any = useRef(null);
    const editRef: any = useRef(null);
    const { message } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (_props.type === 'edit') {
            let value = _props.data.value;
            if (_props.data.type == 5) {
                value = value == 1 ? true : false;
            }
            if(_props.data.type==3)
            {
                value=value.split(",")
            }
            setTimeout(()=>{
                formRef.current.setFieldsValue({
                    type: _props.data.type,
                    title: _props.data.title,
                    value,
                    canDel: _props.data.canDel == 1 ? true : false,
                })
            },1000)
            if (_props.data.type == 4) {
                // setTimeout(() => {
                //     editRef.current.setContent(value)
                // }, 100);
            }
        } else {
            formRef.current.setFieldsValue({
                type: 1,
            })
        }
    }, [])
    // 监听数据改变
    const onValuesChange = (res: any, values: any) => {
        let key = Object.keys(res)[0];
        if (key === 'type') {
            let value = undefined;
            if (values.type === 5) {
                value = false;
            }
            formRef.current.setFieldsValue({
                value,
            })
        } else if (key === 'value') {
            if (values.type === 2) {  // 只能输入数字
                let value = Helper.getNums(res[key]);
                formRef.current.setFieldsValue({
                    value,
                })
            }
        }
    }
    // 提交
    const onFinish = (data: any) => {
        setLoading(true)
        if (data.type === 4) {
            // data.value = data.value.toHTML();
        } else if (data.type === 5) {
            data.value = data.value ? 1 : 0;
        }else if(data.type===3)
        {
            data.value=data.value.join(",")
        }
        var url = 'setting/addSetting';
        if (_props.type == 'edit') {
            url = 'setting/editSetting';
            data.id = _props.data.id;
        } else {
            data.canDel = data.canDel ? 1 : 0;
        }
        console.log(data);
        req.post(url, data).then(res => {
            if (res.code == 1) {
                message.success(res.msg, 1.2)
                _props.onOk()
            } else {
                message.error(res.msg, 1.2);
            }
            setLoading(false);
        })
    }
    return (
        <React.Fragment>
            <Form
                ref={formRef}
                initialValues={{
                    // type: 1,
                }}
                onFinish={onFinish}
                onValuesChange={onValuesChange}
            >
                <div className='flwp'>
                    <Form.Item className='item49' label='配置名称' name='title' rules={[{ required: true, message: '请输入配置名称' }]}>
                        <Input autoComplete='off' placeholder='请输入配置名称' />
                    </Form.Item>
                    <Form.Item className='item49' label='值类型' name='type' required>
                        <Select
                            placeholder='请选择'
                            options={typeList}
                        />
                    </Form.Item>
                    <Form.Item className='item49' label='允许删除' name='canDel' valuePropName='checked'>
                        <Switch disabled={_props.type === 'edit' ? true : false} checkedChildren='是' unCheckedChildren='否' />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type != cur.type}>
                        {({ getFieldValue }) => (
                            <React.Fragment>
                                {/* 文本 */}
                                {getFieldValue('type') === 1 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Input.TextArea rows={8} placeholder='请输入' />
                                </Form.Item>}
                                {/* 数字 */}
                                {getFieldValue('type') === 2 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Input autoComplete='off' placeholder='请输入' />
                                </Form.Item>}
                                {/* 图片 */}
                                {getFieldValue('type') === 3 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <UploadImg   />
                                </Form.Item>}
                                {/* 图文 */}
                                {getFieldValue('type') === 4 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Editor ref={editRef} />
                                </Form.Item>}
                                {/* 开关 */}
                                {getFieldValue('type') === 5 && <Form.Item className='row10' label='配置值' name='value' required valuePropName='checked'>
                                    <Switch checkedChildren='开' unCheckedChildren='关' />
                                </Form.Item>}
                            </React.Fragment>
                        )}
                    </Form.Item>

                </div>
                <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
            </Form>
        </React.Fragment>
    )
};

export default forwardRef(Index);