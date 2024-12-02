import createCache, {COOKIE, STORAGE} from '../../../../src';

const username = createCache('username', {
    useCache: STORAGE,
    json: true,
    raw: true,
});

console.log(username.set('N2NkMTZlMWZhZA1=='));
console.log(username.get());
