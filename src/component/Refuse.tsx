import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Button, Form, Input, Modal, theme } from 'antd';
import CustomModal from './CustomerModal';
import Title from './Title';
interface  RefuseProps{
    onOk: (data:any,callback: (code:number)=>void) => void;//change回调
    title?:string;
}
const Refuse = (_props: RefuseProps, ref: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    useImperativeHandle(ref, () => ({
        setOpen,
    }))
    const onCancel = () => {
        setOpen(false);
    }
    const onFinish = (data: any) => {
        setLoading(true);
        _props.onOk && _props.onOk(data, (code: number) => {
            setLoading(false);
            if (code == 1) {
                setOpen(false);
            }
        });
    }
    return (
        <CustomModal
            open={open}
            title={<Title title={_props.title || '拒绝原因'} />}
            onCancel={onCancel}
        >
            <Form
                onFinish={onFinish}
            >
                <Form.Item label={_props.title || '拒绝原因'} name='info' rules={[{ required: true, message: '请输入' }]}>
                    <Input.TextArea rows={8} placeholder='请输入' />
                </Form.Item>
                <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
            </Form>
        </CustomModal>
    )
};

export default forwardRef(Refuse);