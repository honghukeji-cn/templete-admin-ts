import React, { forwardRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App } from 'antd';
// import CustomSelect from '../../../component/Select';
import CustomerSelect from "../../../component/CustomerSelect";
import * as req from '../../../util/request';

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const onFinish = (data: any) => {
        let url = 'admin/addAdmin';
        if (_props.type === 'edit') {
            url = 'admin/editAdmin';
            data.admin_id = _props.data.admin_id;
        }
        req.post(url, data).then(res => {
            if (res.code == 1) {
                message.success(res.msg, 1.2);
                _props.onOk && _props.onOk();
            } else {
                message.error(res.msg, 1.2)
            }
        })
    }
    return (
        <Form
            onFinish={onFinish}
            autoComplete='off'
            labelCol={{ flex: '82px' }}
            initialValues={{
                username: _props.data.username,
                role_id: _props.data.role_id,
            }}
        >
            <Form.Item label='用户昵称' name='username' rules={[{ required: true, message: '请设置5-12位用户昵称' }]}>
                <Input placeholder='请设置5-12位用户昵称' />
            </Form.Item>
            <Form.Item label='登录密码' name='password'>
                <Input.Password placeholder='留空默认密码为123456' />
            </Form.Item>
            <Form.Item label='角色' name='role_id' rules={[{ required: true, message: '请选择角色' }]}>
                <CustomerSelect type='allrole' />
            </Form.Item>
            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);