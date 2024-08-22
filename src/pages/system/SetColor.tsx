import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import { Button, theme, ColorPicker } from 'antd';
import type { ColorPickerProps, Color } from 'antd/es/color-picker';

const defaultArr = [1, 1, 1, 1, 1, 1, 1, 1];
const colors = [
    { colorPrimary: '#1677ff', colorSuccess: '#52c41a', colorWarning: '#faad14', colorError: '#ff4d4f' },
    { colorPrimary: '#009b6b', colorSuccess: '#0081ff', colorWarning: '#ffb800', colorError: '#FF4B24' },
    { colorPrimary: '#FF7500', colorSuccess: '#1677ff', colorWarning: '#FFB800', colorError: '#FF5722' },
    { colorPrimary: '#37B7A5', colorSuccess: '#319EEB', colorWarning: '#FF895F', colorError: '#ff4d4f' },
]

const Index = (props: any, _ref: any) => {
    const [themeConfig, setThemeConfig] = useState({ colorPrimary: '', colorSuccess: '', colorWarning: '', colorError: '' });
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [color1, setColor1] = useState<Color | string>('');
    const [color2, setColor2] = useState<Color | string>('');
    const [color3, setColor3] = useState<Color | string>('');
    const [color4, setColor4] = useState<Color | string>('');
    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex');
    const {
        token: {
            colorPrimary,
            colorSuccess,
            colorWarning,
            colorError
        },
    } = theme.useToken();
    useEffect(() => {
        const data: any = localStorage.getItem('themeConfig_honghu');
        let row = JSON.parse(data) || { colorPrimary, colorSuccess, colorWarning, colorError };
        setThemeConfig(row);
        setColor1(row.colorPrimary);
        setColor2(row.colorSuccess);
        setColor3(row.colorWarning);
        setColor4(row.colorError);
        let index = colors.findIndex(item => item.colorPrimary === row.colorPrimary);
        setActiveIndex(index);
    }, []);
    const color1HexString = useMemo(
        () => (typeof color1 === 'string' ? color1 : color1.toHexString()), [color1],
    );
    const color2HexString = useMemo(
        () => (typeof color2 === 'string' ? color2 : color2.toHexString()), [color2],
    );
    const color3HexString = useMemo(
        () => (typeof color3 === 'string' ? color3 : color3.toHexString()), [color3],
    );
    const color4HexString = useMemo(
        () => (typeof color4 === 'string' ? color4 : color4.toHexString()), [color4],
    );
    // 重置
    const reset = (index: number) => {
        setColor1(colors[index].colorPrimary);
        setColor2(colors[index].colorSuccess);
        setColor3(colors[index].colorWarning);
        setColor4(colors[index].colorError);
    }
    // 切换配色
    const changeColor = (index: number) => {
        reset(index);
        setThemeConfig({
            colorPrimary: colors[index].colorPrimary,
            colorSuccess: colors[index].colorSuccess,
            colorWarning: colors[index].colorWarning,
            colorError: colors[index].colorError,
        })
        setActiveIndex(index);
    }
    // 预览
    const Preview = () => {
        setThemeConfig({
            colorPrimary: color1HexString,
            colorSuccess: color2HexString,
            colorWarning: color3HexString,
            colorError: color4HexString,
        })
        setActiveIndex(-1)
    }
    // 确定
    const onSave = () => {
        localStorage.setItem('themeConfig_honghu', JSON.stringify(themeConfig));
        window.location.reload();
    }
    return (
        <div className='setColorBox'>
            <div className='flex'>
                <div className='left' style={{overflowX:"scroll"}}>
                    <div className='ltop'>
                        {/* 左边目录 */}
                        <div className='zuo'>
                            <div className='flexCenter'>
                                <p style={{ width: 30, height: 30, marginRight: 8, marginLeft: 20, background: themeConfig.colorPrimary }}></p>
                                <p style={{ flex: 1, height: 30 }}></p>
                            </div>
                            {defaultArr.map((_, index) => (
                                <div className='flexCenter' key={'' + index}>
                                    <p style={{ width: 2, height: 24, background: themeConfig.colorPrimary }}></p>
                                    <p style={{ width: 16, margin: '0 8px 0 20px' }}></p>
                                    <p style={{ flex: 1 }}></p>
                                </div>
                            ))}
                        </div>
                        {/* 右边内容部分 */}
                        <div className='you'>
                            <div className='top' style={{ display: 'flex', alignItems: 'center', height: 70, background: '#fff', paddingRight: 20 }}>
                                <div className='flexCenter'>
                                    <p style={{ width: 16, margin: '0 8px 0 20px' }}></p>
                                    <p style={{ width: 200 }}></p>
                                </div>
                                <div className='flexCenter' style={{ marginLeft: 'auto' }}>
                                    <p style={{ width: 30, height: 30, borderRadius: '100%', margin: '0 8px 0 20px' }}></p>
                                    <p style={{ width: 60 }}></p>
                                </div>
                            </div>
                            <div className='neir'>
                                <p style={{ width: 60, height: 24, background: themeConfig.colorPrimary }}></p>
                                <div className='exap'>
                                    {defaultArr.map((_, index) => (
                                        <div className='flexCenter' style={{ marginTop: 20 }} key={'' + index}>
                                            <p style={{ flex: 1 }}></p>
                                            <p style={{ width: 48, height: 20, marginLeft: 8, background: themeConfig.colorPrimary }}></p>
                                            <p style={{ width: 48, height: 20, marginLeft: 8, background: themeConfig.colorSuccess }}></p>
                                            <p style={{ width: 48, height: 20, marginLeft: 8, background: themeConfig.colorWarning }}></p>
                                            <p style={{ width: 48, height: 20, marginLeft: 8, background: themeConfig.colorError }}></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 颜色方案列表 */}
                    <div className='lbot'>
                        {colors.map((item, index) => (
                            <div className='kkx' style={{ borderColor: activeIndex == index ? themeConfig.colorPrimary : '' }} key={'' + index} onClick={() => changeColor(index)}>
                                <p>预设方案{index + 1}：</p>
                                <div className='flexCenter'>
                                    <p style={{ background: item.colorPrimary }}>主</p>
                                    <p style={{ background: item.colorSuccess }}>辅1</p>
                                    <p style={{ background: item.colorWarning }}>辅2</p>
                                    <p style={{ background: item.colorError }}>辅3</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 自定义配色方案 */}
                <div className='right'>
                    <h2>自定义配色方案：</h2>
                    <div className='flexCenter'>
                        <p>主色：</p>
                        <div className='flexCenter inpt'>
                            <ColorPicker format={formatHex} value={color1} onChangeComplete={(value) => {
                                setColor1(value)
                            }} />
                        </div>
                    </div>
                    <div className='flexCenter'>
                        <p>辅色1：</p>
                        <div className='flexCenter inpt'>
                            <ColorPicker value={color2} onChangeComplete={(value) => {
                                setColor2(value)
                            }} onFormatChange={setFormatHex} />
                        </div>
                    </div>
                    <div className='flexCenter'>
                        <p>辅色2：</p>
                        <div className='flexCenter inpt'>
                            <ColorPicker value={color3} onChangeComplete={(value) => {
                                setColor3(value)
                            }} />
                        </div>
                    </div>
                    <div className='flexCenter'>
                        <p>辅色3：</p>
                        <div className='flexCenter inpt'>
                            <ColorPicker value={color4} onChangeComplete={(value) => {
                                setColor4(value)
                            }} />
                        </div>
                    </div>
                    <Button className='marginr12' type='primary' style={{ background: themeConfig.colorSuccess, borderColor: themeConfig.colorSuccess, }} onClick={() => reset(0)}>重置</Button>
                    <Button type='primary' style={{ background: themeConfig.colorPrimary, borderColor: themeConfig.colorPrimary }} onClick={Preview}>预览</Button>
                </div>
            </div>
            <div className='btnbox flexCenter'>
                <Button className='huibtn' onClick={() => {
                    props.onCancel && props.onCancel();
                }}>取消</Button>
                <Button type='primary' onClick={onSave}>确定</Button>
            </div>
        </div>
    )
};

export default forwardRef(Index);