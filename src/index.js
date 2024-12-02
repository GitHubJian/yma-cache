import createStorage from './storage';
import createCookie from './cookie';

export const COOKIE = 1;
export const STORAGE = 2;

export default function creatCache(key, options) {
    if (options.useCache == COOKIE) {
        return createCookie(key, options);
    } else if (options.useCache == STORAGE) {
        return createStorage(key, options);
    } else {
        console.log("options's useCache must be 1 or 2 for createCache()");
    }
}
