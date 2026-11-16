import React from 'react';
import {act, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Codec from './Codec';
import CryptoTool from './Crypto';
import TimeConvert from './TimeConvert';
import JsonFormat from './JsonFormat';
import Home from '../Home';

// 四个工具页与首页的渲染冒烟测试：能挂载且不抛错、标题出现即通过。
const cases: {name: string; title: string; node: React.ReactElement}[] = [
  {name: 'Codec', title: '编解码', node: <Codec/>},
  {name: 'Crypto', title: '加解密', node: <CryptoTool/>},
  {name: 'TimeConvert', title: '时间转换', node: <TimeConvert/>},
  {name: 'JsonFormat', title: 'JSON 格式化', node: <JsonFormat/>},
  {name: 'Home', title: '工具箱', node: <Home/>},
];

describe.each(cases)('$name 页面', ({title, node}) => {
  test('渲染出页面标题', async () => {
    await act(async () => {
      render(<MemoryRouter>{node}</MemoryRouter>);
    });
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
