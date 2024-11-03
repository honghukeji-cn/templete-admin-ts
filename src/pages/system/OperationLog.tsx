import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Input, theme, App } from 'antd';
import Title from '../../component/Title';
import CustomTable from '../../component/Table';
import CustomerSelect from "../../component/CustomerSelect";
import * as req from '../../util/request';
import Text from '../../component/Text';
import SearchView from "../../component/SearchView";

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
    const [search,setSearch]=useState<any>({});
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
    }, [search])
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
            ...search
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
            <Title title='操作日志列表' />
            <SearchView
                onSearch={(data:any)=>{
                    setSearch(data)
                }}
                items={[
                    {
                        node: <Input
                            placeholder='请输入操作内容关键词'
                        />,
                        label:"操作内容",
                        name:"desc"
                    },
                    {
                        node: <CustomerSelect
                            type="alladmin"
                            placeholder='请选择操作人'
                        />,
                        label:"操作人",
                        name:"admin_id"
                    },
                    {
                        node:  <Input
                            placeholder='请输入操作IP'
                        />,
                        label:"操作IP",
                        name:"ip"
                    }
                ]}
            />
            <CustomTable
                ref={tableRef}
                columns={columns}
                onRefresh={onRefresh}
                auto={false}
            />
        </React.Fragment>
    )
};

export default forwardRef(Index);