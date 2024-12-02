# YMA Cache

## Install

```sh
npm i yma-cache
```

## Usage

```js
import createCache, {COOKIE, STORAGE} from 'yma-cache';

const c = createCache('c', {
    useCache: COOKIE, // 使用Cookie
    raw: false, // 是否需要 encodeURIComponent 转换
    json: false, // 是否转为 JSON 进行存储
    expires: 1, // 毫秒
    domain, // 所在的域
    path, // 所在的目录
    secure, // 以安全的形式向服务器传输
});

// 只有 expires 属性
const c = createCache('c', {
    useCache: STORAGE, // 使用 STORAGE
    json: false, // 是否转为 JSON 进行存储
    expires: 1, // 毫秒
});
```
