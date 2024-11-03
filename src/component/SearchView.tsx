import React, {useImperativeHandle, forwardRef, useState, ReactNode} from 'react';
import {Button, Col, Form, Input, Modal, Row, Space, theme} from 'antd';
import { DownOutlined } from '@ant-design/icons';
interface SearchFormItem {
    node:ReactNode,
    label:string,
    name:string
}
interface  SearchViewProps{
    onSearch?: (data:any) => void;//搜索回调
    items?:SearchFormItem[];
    expandItems?:SearchFormItem[];
    buttons?:ReactNode[];
}


const Refuse = (_props: SearchViewProps, ref: any) => {
    const [form] = Form.useForm();
    const [expand,setExpand]=useState(false);
    const onSearch=(data:any)=>{
        _props.onSearch?.(data);
    }
    return (
        <div className='searchView'>
            <Form
                form={form}
                onFinish={onSearch}
                autoComplete='off'
                size={"middle"}
            >
                <Row align={"stretch"} gutter={12}>
                    {_props.items?.map((item,key)=>(
                        <Col key={key} span={6} xs={24} sm={12} md={8} lg={8} xl={8} xxl={6} >
                            <Form.Item label={item.label} name={item.name}>
                                {item.node}
                            </Form.Item>
                        </Col>
                    ))}
                    {expand && _props.expandItems?.map((item,key)=>(
                        <Col key={key} className={"formCol"} style={{height:30}} span={6} xs={24} sm={12} md={8} lg={8} xl={8} xxl={6} >
                            <Form.Item label={item.label} name={item.name}>
                                {item.node}
                            </Form.Item>
                        </Col>
                    ))}
                    <Space align={"start"} size="small" wrap={true}>
                        {_props.items && _props.items.length>0 &&
                        <>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    onSearch({})
                                }}
                            >
                                重置
                            </Button>
                        </>
                        }
                        {_props.buttons?.map((button,key)=>(
                            <React.Fragment key={key}>
                                {button}
                            </React.Fragment>
                        ))}
                        {_props.expandItems && _props.expandItems.length>0 &&
                        <a
                            style={{
                                fontSize: 12,
                            }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            <DownOutlined rotate={expand ? 180 : 0} /> {expand?"收起":"展开"}
                        </a>
                        }
                    </Space>
                </Row>
            </Form>

        </div>
    )
};

export default forwardRef(Refuse);