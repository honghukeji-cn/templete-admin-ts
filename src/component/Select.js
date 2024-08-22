import React from 'react';
import { Select } from 'antd';
import * as req from '../util/request';

const { Option } = Select;

export default class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data || []
        }
    }
    componentDidMount() {
        if (this.props.type) {
            var url = '';
            if (this.props.type == 'allrole') {
                url = 'admin/getSearchRoleList';
            } else if (this.props.type == 'alladmin') {
                url = 'admin/getSearchAdminList';
            }
            req.post(url, {}).then(res => {
                if (res.code === 1) {
                    var data = this.initData(res.data);
                    this.setState({
                        data,
                    })
                }
            })
        }
    }
    initData(arry) {
        let arryNew = []
        arry.map((item, index) => {
            arryNew.push(Object.assign({}, item, { value: item.id, label: item.name }))
        })
        return arryNew
    }
    render() {
        return (
            <Select
                placeholder='请选择'
                suffixIcon={(<span className='iconfont icon-xia'></span>)}
                allowClear
                className={`pubSelt ${this.props.className}`}
                options={this.state.data}
                {...this.props}
            >
                {/* {this.state.data.map((item, index) => (
                    <Option value={item.value * 1} key={'' + index}>{item.label}</Option>
                ))} */}
            </Select>
        )
    }
}