import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Input, theme, App } from 'antd';
import Title from '../../component/Title';
import CustomTable from '../../component/Table';
import CustomerSelect from "../../component/CustomerSelect";
import * as req from '../../util/request';
import Text from '../../component/Text';

const Index = (_props: any, ref: any) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { message, modal } = App.useApp();
    const tableRef: any = useRef(null);
    const [admin_id, setAdminId] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [ip, setIp] = useState<string>('');
    // 列表
    const columns = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'key',
            width: 90,
        }, {
            title: '操作人',
            align: 'center',
            dataIndex: 'username'
        }, {
            title: '操作内容',
            align: 'center',
            dataIndex: 'desc',
            render: (time: string) => `${time || '-'}`
        }, {
            title: '操作IP',
            align: 'center',
            dataIndex: 'ip',
            render: (ip: string) => `${ip || '-'}`
        }, {
            title: '操作时间',
            align: 'center',
            dataIndex: 'atime'
        }
    ]
    useEffect(() => {
        refresh()
    }, [admin_id, desc, address, ip])
    useImperativeHandle(ref, () => ({
        refresh,
    }))
    const refresh = () => {
        tableRef.current.onRefresh()
    }
    // 获取列表数据
    const getList = (info: any, callback: any) => {
        req.post('admin/adminLog', {
            page: info.page,
            size: info.size,
            orderBy: '',
            admin_id,
            address,
            ip,
            desc,
        }).then(res => {
            callback(res)
        })
    }
    // 首次进入页面初始化
    const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
        getList(info, callback)
    }
    return (
        <React.Fragment>
            <div className='h100 flexColumn'>
                <div className='flwp'>
                    <Input
                        placeholder='请输入操作内容关键词'
                        className='pubInpt borderbai marginr12'
                        onChange={(e) => {
                            setDesc(e.target.value || '');
                        }}
                    />
                    <CustomerSelect
                        type="alladmin"
                        placeholder='请选择操作人'
                        className='pubSelt marginr12 borderbai'
                        style={{ width: 160 }}
                        onChange={(admin_id: string) => {
                            setAdminId(admin_id || '')
                        }}
                    />
                    <Input
                        placeholder='请输入操作IP'
                        prefix={null}
                        className='pubInpt borderbai marginr12'
                        onChange={(e) => {
                            setIp(e.target.value || '');
                        }}
                    />
                </div>
                <div className='bgbai margt20 flex_auto'>
                    <Title title='操作日志列表' />
                    <CustomTable
                        ref={tableRef}
                        columns={columns}
                        onRefresh={onRefresh}
                        auto={false}
                    />
                </div>
            </div>
        </React.Fragment>
    )
};

export default forwardRef(Index);