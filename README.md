# lq-fetch
> 数据请求fetch公共接口

[项目地址](https://github.com/luoqi14/lq-fetch)

## Installation

  ```
  npm install lq-fetch --save
  ```
  
## Initialization
```
import fetch from lq-fetch;

fetch.init({
  baseUrl: '',
  addAuth: undefined,
  monitor: {
    start: () => {},
    end: () => {},
    error: () => {},
  },
  hash: '',
  resProps: {
    resultCode: 'resultCode',
    resultDesc: 'resultDesc',
    resultData: 'resultData',
  },
  refreshToken: {
    invalidCode: '',
    url: '',
    getValue: undefined,
    key: 'refreshToken',
    beforeRefresh: () => {},
    afterRefresh: () => {},
  },
});
```
- headers为默认请求头
- baseUrl为接口url前缀，环境区分
- addAuth为请求头Authorization的值
- monitor为对象，start请求开始执行函数，end请求结束执行函数，error请求出错执行函数
- get请求加hash
- resProps设置返回属性
- refreshToken支持自动刷新
  - invalidCode为失效code
  - url为刷新token请求url，记得是全路径
  - getValue为函数，返回refreshToken值
  - key为刷新token的传参属性，默认为refreshToken
  - beforeRefresh和afterRefresh为事件函数
  
## Usage
```
import fetch from lq-fetch;

fetch(url, params, opts);
```
- url为相对或绝对路径请求url
- params为post参数
- opts可以覆盖method、header等属性的对象
