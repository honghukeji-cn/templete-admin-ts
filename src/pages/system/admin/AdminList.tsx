import React, { useImperativeHandle, forwardRef, useRef, useState,useEffect } from 'react';
import {Button, Input, theme, App, Form, Row, Col, Space, Tooltip, Modal} from 'antd';
import Title from '../../../component/Title';
import CustomTable from '../../../component/Table';
import CustomModal from '../../../component/CustomerModal';
import CustomerSelect from "../../../component/CustomerSelect";
import * as req from '../../../util/request';
import AddAdmin from './AddAdmin';
import SearchView from "../../../component/SearchView";
import Text from "../../../component/Text";

const Index = (_props: any, ref: any) => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<{ id?: number, role_name?: string, describe?: string, ids?: [] }>({});
	const [type, setType] = useState<string>('');
	const [search,setSearch]=useState<any>({});
	// 列表
	const columns = [
		{
			title: 'ID',
			align: 'center',
			dataIndex: 'admin_id',
			width: 80,
		}, {
			title: '用户昵称',
			align: 'center',
			width: 120,
			dataIndex: 'username'
		}, {
			title: '角色',
			align: 'center',
			width: 120,
			dataIndex: 'role_name'
		}, {
			title: '上次登录时间',
			align: 'center',
			dataIndex: 'last_login_time',
			width: 180,
			render: (time: string) => `${time || '-'}`
		}, {
			title: '上次登录IP',
			align: 'center',
			width: 180,
			dataIndex: 'last_login_ip',
			render: (ip: string) => `${ip || '-'}`
		}, {
			title: '状态',
			align: 'center',
			width: 120,
			dataIndex: 'status',
			render:(status:number,item:any)=>{
				return(
					<Tooltip title={"点击"+(status==0?"解冻":"冻结")+"用户"}>
						<Text onClick={()=>{
							Modal.confirm({
								title:"提示",
								content:"确定要"+(status==0?"解冻":"冻结")+"该用户吗?",
								onOk:()=>{
									// return new Promise<void>(resolve => {
									// 	req.post('device/delDevice', { id }).then(res => {
									// 		resolve()
									// 		if (res.code == 1) {
									// 			message.success(res.msg);
									// 			refresh()
									// 		} else {
									// 			message.error(res.msg, 1.2);
									// 		}
									// 	})
									// });
									return new Promise<void>(resolve => {
										req.post('admin/changeAdminStatus/'+item.admin_id, {  }).then((res:any) => {
											resolve();
											if (res.code == 1) {
												refresh()
											} else {
												message.error(res.msg, 1.2);
											}
										}).catch((err)=>{
											console.log(err)
											message.error(err.toString(), 1.2);
											resolve()
										})
									})
								}
							})
						}}  className={"cursor"} type={status==0?"error":"primary"}>{status==0?"冻结":"正常"}</Text>
					</Tooltip>
				);
			}
		}, {
			title: '添加时间',
			align: 'center',
			width: 180,
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'id',
			width: 150,
			align: 'center',
			render: (id: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					<p style={{ color: colorPrimary }} onClick={() => {
						setRow(item)
						setType('edit');
						setOpen(true)
					}}>编辑</p>
					<p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
				</div>
			)
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
		req.post('admin/adminList', {
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
	const onCancel = () => {
		setOpen(false);
		setRow({});
		setType('')
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('admin/delAdmin', { admin_id: data.admin_id }).then(res => {
					if (res.code == 1) {
						refresh()
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	const onSearch=(data:any)=>{

	}
	return (

		<React.Fragment>


			<Title title='管理员列表' />
			<SearchView
				onSearch={(data:any)=>{
					setSearch(data)
				}}
				items={[
					{
						node:<Input
								placeholder='请输入'
								allowClear
							/>,
						label:"用户名",
						name:"name"
					},
					{
						node:<CustomerSelect
								type='allrole'
								placeholder='请选择角色'
							/>,
						label:"角色",
						name:"role_id"
					},
				]}
				buttons={[
					<Button type="primary" onClick={() => {
						setOpen(true);
					}}>添加管理员</Button>
				]}
			/>
			<CustomTable
				ref={tableRef}
				columns={columns}
				onRefresh={onRefresh}

				scroll={{ x:1010 }}
			/>
			{/* 添加/编辑 */}
			<CustomModal
				open={open}
				width={360}
				onCancel={onCancel}
				title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}管理员`} />)}
			>
				<AddAdmin type={type} data={row} onOk={()=>{
					setOpen(false);
					refresh()
				}} />
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);