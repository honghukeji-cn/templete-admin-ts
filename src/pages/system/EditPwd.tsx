import React, { useEffect, useState } from 'react';
import { Button, Form, Input,App } from 'antd';
import * as req from '../../util/request';

const Index = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const onFinish = (data: any) => {
        setLoading(true);
        req.post("admin/editPwd", data).then(res => {
            if (res.code === 1) {
                message.success('修改成功，请重新登录！', 1.2, () => {
                    window.location.href = ''
                })
            } else {
                message.error(res.msg, 1.2)
            }
        })
    }
    return (
        <Form
            form={form}
            name="validateOnly"
            autoComplete="off"
            labelCol={{ flex: '82px' }}
            onFinish={onFinish}
        >
            <Form.Item label='原密码' name='oldPwd' rules={[{ required: true, message: '请输入6-18位原密码' }]}>
                <Input.Password placeholder='请输入6-18位原密码' />
            </Form.Item>
            <Form.Item label='新密码' name='password' rules={[{ required: true, message: '请输入6-18位原密码' }, { type: 'string', min: 6, max: 18 }]}>
                <Input.Password placeholder='请设置6-18位新密码' />
            </Form.Item>
            <Form.Item label='确认密码' name='pwd1' rules={[{ required: true,message: '请再次输入密码' }, ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不一致!'));
                }
            })]} >
                <Input.Password placeholder='请再次输入新密码' />
            </Form.Item>
            <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
}

export default Index;