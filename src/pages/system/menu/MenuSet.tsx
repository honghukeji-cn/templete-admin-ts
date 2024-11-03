import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Pagination, Switch, App, theme } from 'antd';
import Title from '../../../component/Title';
import CustomModal from '../../../component/CustomerModal';
import * as req from '../../../util/request';
import AddMenu from './AddMenu';
import SearchView from "../../../component/SearchView";  // 添加、编辑菜单

const levelTxt = ['', '一级菜单', '二级菜单', '三级菜单']

const Index = (_props: any, ref: any) => {
	const { message, modal } = App.useApp();
	const {
		token: { colorPrimary, colorWarning, colorError, colorSuccess },
	} = theme.useToken();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [list, setList] = useState([] as any[]);
	const [total, setTotal] = useState<number>(0);
	const [level, setLevel] = useState<number>(1);
	const [row, setRow] = useState<object>({});
	const [type, setType] = useState<string>('add');
	const colorArr = ['', colorSuccess, colorWarning, colorError];
	useEffect(() => {
		getMenu();
	}, [page])
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		console.log('菜单管理');
		getMenu();
	}
	const getMenu = () => {
		let data = {
			page,
			size: 10,
			orderBy: '',
		}
		req.post('menu/menuList', data).then(res => {
			if (res.code === 1) {
				setList(res.data.datas);
				setTotal(res.data.all);
			}
		})
	}
	// 打开
	const openMenu = (index: number, k: number = -1, i: number = -1) => {
		const data: any = JSON.parse(JSON.stringify(list));
		if (i > -1) {
			data[index].child[k].child[i].open = !data[index].child[k].child[i].open;
		} else {
			if (k > -1) {
				data[index].open = true;
				data[index].child[k].open = !data[index].child[k].open;
			} else {
				data[index].open = !data[index].open;
			}
		}
		setList(data);
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('menu/delMenu', { id: data.id }).then(res => {
					if (res.code == 1) {
						getMenu();
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	// 根据id获取索引
	function getIndex(data: any) {
		const arr = JSON.parse(JSON.stringify(list));
		let tindex = -1,
			findex = -1,
			sindex = -1;
		if (data.level === 3) {
			aaa:
			for (let i in arr) {
				let sec = arr[i].child;
				for (let j in sec) {
					tindex = sec[j].child.findIndex((item: any) => item.id === data.id);
					if (tindex > -1) {
						findex = Number(i);
						sindex = Number(j);
						break aaa
					}
				}
			}
		} else if (data.level === 2) {
			asd:
			for (let i in arr) {
				sindex = arr[i].child.findIndex((item: any) => item.id === data.id);
				if (sindex > -1) {
					findex = Number(i);
					break asd
				}
			}
		} else if (data.level === 1) {
			findex = arr.findIndex((item: any) => item.id === data.id);
		}
		return { findex, sindex, tindex };
	}
	// 打印日志切换
	const changeLog = (data: any) => {
		const { findex, sindex, tindex } = getIndex(data);
		req.post('menu/setNeedLog', {
			id: data.id,
			needLog: data.needLog === 1 ? 0 : 1,
		}).then(res => {
			if (res.code === 1) {
				const arr = JSON.parse(JSON.stringify(list));
				if (data.level === 1) {
					arr[findex].needLog = data.needLog === 1 ? 0 : 1;
				} else if (data.level === 2) {
					arr[findex].child[sindex].needLog = data.needLog === 1 ? 0 : 1;
				} else if (data.level === 3) {
					arr[findex].child[sindex].child[tindex].needLog = data.needLog === 1 ? 0 : 1;
				}
				setList(arr);
			}
		})
	}
	// 
	const getTxt = (item: any, id?: number) => {
		return (
			<React.Fragment>
				<p className='rowFlex'>{item.path || '-'}</p>
				<p className='rowFlex'>{item.route || '-'}</p>
				<p className='row15' style={{ color: colorArr[item.level] }}>
					{levelTxt[item.level]}
				</p>
				<p className='rowFlex'>
					<Switch checked={item.needLog == 1 ? true : false} unCheckedChildren='关闭' checkedChildren='打开' onClick={() => changeLog(item)} />
				</p>
				<p className='rowFlex'>
					<Button className='font12' size='small' type='primary' danger={item.display != 1 ? true : false}>{item.display == 1 ? '显示' : '隐藏'}</Button>
				</p>
				<div className='row2 flexAllCenter pubbtnbox'>
					{item.level < 3 && <p style={{ color: colorPrimary }} onClick={() => {
						let fid,
							sid;
						if (item.level == 1) {
							fid = item.id;
						} else if (item.level == 2) {
							fid = item.pid;
							sid = item.id;
						}
						setRow({
							fid,
							sid,
						})
						setLevel(parseInt(item.level) + 1);
						setType('add');
						setOpen(true);
					}}>添加子菜单</p>}
					<p style={{ color: colorPrimary }} onClick={() => {
						let fid,
							sid;
						if (item.level == 2) {
							fid = item.pid;
							sid = item.id;
						} else if (item.level == 3) {
							fid = id;
							sid = item.pid;
						}
						setRow({
							...item,
							fid,
							sid,
						})
						setLevel(item.level);
						setType('edit');
						setOpen(true);
					}}>编辑</p>
					<p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
				</div>
			</React.Fragment>
		)
	}
	// 关闭弹窗
	const onCancel = () => {
		setOpen(false);
	}
	return (
		<React.Fragment>
			<Title title='菜单管理' />
			<SearchView
			buttons={[<Button type="primary" onClick={() => {
				setRow({ pid: 0 });
				setLevel(1);
				setType('add');
				setOpen(true);
			}}>添加菜单</Button>]}
			/>
			{/* 菜单列表 */}
			<div className='pubList margl24 margr24 menuListbox customScrollbar'>
				<div className='head flex'>
					<p className='flexAllCenter cursor' style={{ width: 90 }}>
						序号
					</p>
					<p className='row2'>菜单名称</p>
					<p className='rowFlex'>前端路由</p>
					<p className='rowFlex'>后端路由</p>
					<p className='row15'>菜单等级</p>
					<p className='rowFlex'>打印日志</p>
					<p className='rowFlex'>显示状态</p>
					<p className='row2'>操作</p>
				</div>
				{list.map((item, index) => (
					<div key={String(index)}>
						{/* 一级 */}
						<div className='flex'>
							<p className='flexAllCenter cursor' style={{ width: 90 }}>{index + 1}</p>
							<div className='row2 flexCenter paddleft98'>
								{item.child.length > 0 && <span className={`iconfont icon-jiantou-shang sjx ${item.open ? 'xia' : ''}`} onClick={() => openMenu(index)}></span>}
								<span className={`iconfont ${item.icon}`} style={{ marginLeft: item.child.length === 0 ? 16 : '', }}></span>
								<p className='zii'>{item.name}</p>
							</div>
							{getTxt(item)}
						</div>
						{item.child && item.child.length > 0 && <React.Fragment>
							{item.child.map((row: any, k: number) => (
								<div key={String(k)} className={`sec ${item.open ? 'open' : ''}`} style={{ height: row.open && item.open && (row.child.length + 1) * 54 }}>
									{/* 二级 */}
									<div className='flex'>
										<p className='flexAllCenter cursor' style={{ width: 90 }}>{k + 1}</p>
										<div className='row2 flexCenter paddleft98'>
											{row.child.length > 0 && <span className={`iconfont icon-jiantou-shang sjx ${row.open ? 'xia' : ''}`} onClick={() => openMenu(index, k)} style={{ marginLeft: row.child.length > 0 ? 20 : '' }}></span>}
											<span className={`iconfont icon-wenjian`} style={{ marginLeft: row.child.length === 0 ? 36 : '', }}></span>
											<p className='zii'>{row.name}</p>
										</div>
										{getTxt(row)}
									</div>
									{row.child && <div className={`three ${row.open ? 'open' : ''}`} style={{ height: row.open ? row.child.length * 54 : '0' }}>
										{row.child.map((r: any, i: number) => (
											<div className='flex' key={String(i)}>
												<p className='flexAllCenter cursor' style={{ width: 90 }}>{i + 1}</p>
												<div className='row2 flexCenter paddleft98'>
													{r.child.length > 0 && <span className={`iconfont icon-jiantou-shang sjx ${r.open ? 'xia' : ''}`} onClick={() => openMenu(index, k, i)}></span>}
													<span className={`iconfont icon-wenjian`} style={{ marginLeft: r.child.length === 0 ? 56 : '', }}></span>
													<p className='zii'>{r.name}</p>
												</div>
												{getTxt(r, item.id)}
											</div>
										))}
									</div>}
								</div>
							))}
						</React.Fragment>}
					</div>
				))}
			</div>
			{/* 页码 */}
			<Pagination
				current={page}
				total={total}
				showTotal={(total, range) => {
					return `共${total}条记录，本页展示${range[0]}-${range[1]}条记录`
				}}
				showSizeChanger={false}
				onChange={(page) => {
					setPage(page)
				}}
				className='margl24 margr24 margt10'
			/>
			{/* 添加、编辑菜单 */}
			<CustomModal
				open={open}
				width={360}
				title={<Title title={`${type === 'add' ? '添加' : '编辑'}菜单`} />}
				onCancel={onCancel}
			>
				<AddMenu
					type={type}
					level={level}
					data={row}
					onCancel={onCancel}
					onOk={()=>{
						getMenu();
						onCancel();
					}}
				/>
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);