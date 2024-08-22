import React from 'react';
import { Modal } from 'antd'

export default class CustomerModal extends React.Component {
    render() {
        return (
            <Modal
                centered={true}
                destroyOnClose={true}
                footer={null}
                closeIcon={(<p className='iconfont icon-guanbi'></p>)}
                {...this.props}
            ></Modal>
        )
    }
}
