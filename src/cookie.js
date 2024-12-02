import {looseEqual, encode, decode} from './util';

const defaults = function () {
    return {
        raw: false,
        json: false,
        serializer: function (value) {
            const {raw, json} = this;

            try {
                return encode(
                    json ? JSON.stringify(value) : String(value),
                    raw
                );
            } catch (e) {
                console.error('[Yma Cache] Serializer Error: ');
                console.error(e);
            }
        },
        parser: function (s) {
            const {raw, json} = this;

            if (s.indexOf('"') === 0) {
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                const pluses = /\+/g;
                s = decodeURIComponent(s.replace(pluses, ' '));

                return raw ? s : json ? JSON.parse(s) : s;
            } catch (e) {
                console.error('[Yma Cache] Parser Error: ');
                console.error(e);
            }
        },
        onChange: function (newVal, oldVal, key) {
            console.log(
                [
                    ['key', key],
                    ['newVal', newVal],
                    ['oldVal', oldVal],
                ]
                    .map(function (item) {
                        return item[0] + ': ' + item[1];
                    })
                    .join(', ')
            );
        },
    };
};

export default function createCookie(key, options) {
    options = Object.assign({}, defaults(), options || {});

    const {raw, onChange} = options;
    const parser = options.parser.bind(options);
    const serializer = options.serializer.bind(options);

    function get() {
        let result = undefined,
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;

        for (; i < l; i++) {
            let parts = cookies[i].split('='),
                name = decode(parts.shift(), raw),
                cookie = parts.join('=');

            if (key === name) {
                result = parser(cookie);
                break;
            }

            if (!key && (cookie = parser(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    }

    function set(value) {
        if (typeof options.expires === 'number') {
            let expires = options.expires,
                t = (options.expires = new Date());
            t.setTime(t.getTime() + expires);
        }

        document.cookie = [
            encode(key, raw),
            '=',
            serializer(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : '',
        ].join('');

        const oldVal = get();
        if (!looseEqual(value, oldVal)) {
            onChange && onChange(value, oldVal, key);
        }

        return value;
    }

    function remove() {
        set('', {
            expires: -1,
        });
    }

    return {
        get,
        set,
        remove,
    };
}
