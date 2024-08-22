import React from 'react';
import type { FC } from 'react';
import { Spin } from 'antd';

const Index: FC = () => (
    <div className='' style={{textAlign: 'center',paddingTop: '20vh'}}>
        <Spin></Spin>
        <p style={{fontSize: 14,color: '#666',marginTop: 10,}}>加载中...</p>
    </div>
);

export default Index;