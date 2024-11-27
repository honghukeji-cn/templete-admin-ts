import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import {Button, DatePicker, theme, App, Modal} from 'antd';
import Title from '../../component/Title';
import CustomTable from '../../component/Table';
import CustomerSelect from "../../component/CustomerSelect";
import * as req from '../../util/request';
import Text from '../../component/Text';
import SearchView from "../../component/SearchView";
import Helper from "../../util/Helper";

const Index = (_props: any, ref: any) => {
    const {
        token: { colorPrimary,colorError,colorWarning },
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
            title: 'ID',
            align: 'center',
            dataIndex: 'id',
            width: 90,
        }, {
            title: '操作人',
            align: 'center',
            dataIndex: 'admin_name',
            width: 150
        }, {
            title: '文件名',
            align: 'center',
            dataIndex: 'file_name',
            width: 150
        }, {
            title: '文件大小',
            align: 'center',
            dataIndex: 'file_size',
            width: 150,
            render:(size:number)=>{
                return Helper.getFileSize(size);
            }
        }, {
            title: '备份时间',
            align: 'center',
            dataIndex: 'atime',
            width: 150
        }, {
            title: '操作',
            dataIndex: 'id',
            width: 150,
            align: 'center',
            render: (id: number, item: any) => (
                <div className='flexAllCenter pubbtnbox'>
                    <p style={{ color: colorPrimary }} onClick={() => {
                        xiazai(item)
                        // window.open("/admin/backup/download/"+item.id)
                    }}>下载</p>
                    <p style={{ color: colorError }} onClick={() => huifu(item)}>恢复</p>
                    <p style={{ color: colorWarning }} onClick={() => del(item)}>删除</p>
                </div>
            )
        }
    ]

    const xiazai=(item:any)=>{
        Modal.confirm({
            title:"提示",
            content:"确定要下载该备份文件吗?",
            onOk:()=>{
                return new Promise<void>(resolve => {
                    req.post('backup/download/'+item.id, {  }).then((res:any) => {
                        resolve();
                        if(!res.code && res.code!=0)
                        {
                            Helper.saveAs(res,item.file_name)
                        }
                    })
                });
            }
        })
    }
    const huifu=(item:any)=>{
        Modal.confirm({
            title:"提示",
            content:"确定要恢复该备份文件吗?",
            onOk:()=>{
                return new Promise<void>(resolve => {
                    req.post('backup/restoreDb/'+item.id, {  }).then((res:any) => {
                        resolve()
                        if (res.code == 1) {
                            message.success(res.msg);
                            refresh()
                        } else {
                            message.error(res.msg, 1.2);
                        }
                    })
                });
            }
        })
    }
    const del=(item:any)=>{
        Modal.confirm({
            title:"提示",
            content:"确定要删除该备份文件吗?",
            onOk:()=>{
                return new Promise<void>(resolve => {
                    req.post('backup/removeBackUpFile/'+item.id, {  }).then((res:any) => {
                        resolve()
                        if (res.code == 1) {
                            message.success(res.msg);
                            refresh()
                        } else {
                            message.error(res.msg, 1.2);
                        }
                    })
                });
            }
        })
    }
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
        req.post('backup/getList', {
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
    const beifen=()=>{
        Modal.confirm({
            title:"提示",
            content:"确定要备份当前数据库?",
            onOk:()=>{
                return new Promise<void>(resolve => {
                    req.post('backup/backUpDb', {  }).then((res:any) => {
                        resolve()
                        if (res.code == 1) {
                            message.success(res.msg);
                            refresh()
                        } else {
                            message.error(res.msg, 1.2);
                        }
                    })
                });
            }
        })
    }
    return (
        <React.Fragment>
            <Title title='数据库备份列表' />
            <SearchView
                onSearch={(data:any)=>{

                    if(data.times)
                    {
                        data.stime=data.times[0].format("YYYY-MM-DD HH:mm:ss")
                        data.etime=data.times[1].format("YYYY-MM-DD HH:mm:ss")
                        delete  data.times;
                    }
                    setSearch(data)
                }}
                items={[
                    {
                        node:  <DatePicker.RangePicker

                            inputReadOnly

                        />,
                        label:"备份时间",
                        name:"times"
                    },
                    {
                        node: <CustomerSelect
                            type="alladmin"
                            placeholder='请选择操作人'
                        />,
                        label:"操作人",
                        name:"admin_id"
                    }
                ]}
                buttons={[
                    <Button type="primary" onClick={() => {
                       beifen();
                    }}>备份</Button>
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