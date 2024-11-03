import React, { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { App, Button, Image, Switch, theme } from 'antd';
import Title from '../../../component/Title';
import CustomTable from '../../../component/Table';
import CustomModal from '../../../component/CustomerModal';
import AddBasic from './AddBasic';  // 添加配置
import Text from '../../../component/Text';
import * as req from '../../../util/request';
import SearchView from "../../../component/SearchView";

// const typeList = [
// 	{ value: 1, label: '文本' },
// 	{ value: 2, label: '数字' },
// 	{ value: 3, label: '图片' },
// 	{ value: 4, label: '图文' },
// 	{ value: 5, label: '开/关' },
// ]
const typeList = ['', '文本', '数字', '图片', '图文', '开/关'];

const Index = (_props: any, ref: any) => {
	const {
		token: { colorPrimary, colorWarning, colorInfo, colorSuccess },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<any>({});
	const [type, setType] = useState<string>();
	const columns = [{
		title: '配置ID',
		align: 'center',
		dataIndex: 'id',
		width: 90,
	}, {
		title: '配置名称',
		align: 'center',
		dataIndex: 'title',
		ellipsis: true,
	}, {
		title: '配置值',
		align: 'center',
		dataIndex: 'value',
		ellipsis: true,
		render: (value: string, item: any) => (
			<React.Fragment>
				{(item.type == 1 || item.type == 2) && value}
				{item.type == 3 && <Image src={value} width={40} height={40} />}
				{item.type == 4 && '图文内容请在详情中查看'}
				{item.type == 5 && <Switch disabled checked={value == '1' ? true : false} checkedChildren='开' unCheckedChildren='关' />}
			</React.Fragment>
		)
	}, {
		title: '值类型',
		align: 'center',
		dataIndex: 'type',
		render: (type: number) => (
			<Button
				type='primary'
				size='small'
				style={{
					background: type == 2 ? colorInfo : (type == 3 ? colorSuccess : (type == 1 ? colorPrimary : colorWarning))
				}}
			>{typeList[type]}</Button>
		)
	}, {
		title: '操作',
		dataIndex: 'id',
		align: 'center',

		width: 150,
		render: (id: number, item: any) => (
			<div className='flexAllCenter pubbtnbox'>
				{/* <p style={{ color: colorPrimary }}>编辑</p>
					{item.canDel == 1 && <p style={{ color: colorPrimary }}>删除</p>} */}
				<Text onClick={() => {
					item.type = Number(item.type)
					setType('edit')
					setRow(item)
					setOpen(true)
				}}>编辑</Text>
				{item.canDel == 1 && <Text onClick={() => del(id)}>删除</Text>}
			</div>
		)
	}]
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		tableRef.current.onRefresh()
	}
	const getList = (info: { page: number, size: number }, callback: any) => {
		req.post('setting/settingList', {
			page: info.page,
			size: info.size,
			orderBy: ''
		}).then(res => {
			callback(res);
		})
	}
	// 首次进入页面初始化
	const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
		getList(info, callback)
	}
	const onCancel = () => {
		setRow({})
		setType('')
		setOpen(false);
	}
	// 删除
	const del = (id: number) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('setting/delSetting', { id }).then(res => {
					if (res.code === 1) {
						if (res.code == 1) {
							message.success(res.msg, 1.2);
							refresh();
						} else {
							message.error(res.msg, 1.2);
						}
					}
				})
			}
		})
	}
	return (
		<React.Fragment>
			<Title title='基本信息配置列表' />
			<SearchView
			buttons={[<Button type="primary" onClick={() => {
				setOpen(true)
			}}>添加配置</Button>]}
			/>

			<CustomTable
				ref={tableRef}
				columns={columns}
				onRefresh={onRefresh}

			/>
			{/* 添加/编辑 */}
			<CustomModal
				open={open}
				width={696}
				onCancel={onCancel}
				title={(<Title title={`${type == 'edit' ? '编辑' : '添加'}配置`} />)}
			>
				<AddBasic
					type={type}
					data={row}
					onOk={() => {
						onCancel()
						refresh()
					}}
				/>
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);