import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Form, Input, App } from 'antd';
import FileList from '../../component/FileList';
import * as req from '../../util/request';

interface types {
    value?: string;
    onChange?: (value: string) => void;
}
// 上传图片组件
const CustomUpload: React.FC<types> = ({ value = '', onChange }) => {
    const fileRef: any = useRef(null);
    const triggerChange = (url: string) => {
        onChange?.(url);
    };
    return (
        <React.Fragment>
            <div className='editavatar cursor' style={{ border: value !== '' ? 0 : '' }} onClick={() => {
                fileRef.current.refresh();
            }}>
                {value === '' && <img alt='' src={require('../../static/default.png')} />}
                {value !== '' && <img alt='' src={value} style={{ width: '60px', height: '60px' }} />}
                <span className='zi'>修改头像</span>
            </div>

            {/* 文件库 */}
            <FileList ref={fileRef} type={1} onOk={(data: any) => {
                triggerChange(data[0])
            }} />
        </React.Fragment>
    )
}
const Index = (_props: any, ref: any) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const info=_props.data;
    console.log(info)
    useEffect(() => {
        form.setFieldsValue(_props.data)
    }, [])
    const onFinish = (data: any) => {
        console.log(data)
        setLoading(true)
        req.post('admin/editAvatar', data).then(res => {
            if (res.code == 1) {
                message.success(res.msg, 1.2)
                _props.onOk()
            } else {
                message.error(res.msg, 1.2)
            }
            setLoading(false)
        })
    }
    return (
        <Form
            form={form}
            onFinish={onFinish}
            autoComplete='off'
        >
            <Form.Item name='avatar'>
                <CustomUpload />
            </Form.Item>
            <Form.Item label='我的昵称' name='username' rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder='请输入昵称' />
            </Form.Item>
            <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);