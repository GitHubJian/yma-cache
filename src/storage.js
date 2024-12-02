import {looseEqual, encode, decode} from './util';

const defaults = function () {
    return {
        raw: false,
        json: false,
        serializer: function (value) {
            const {raw, json} = this;

            try {
                return json ? JSON.stringify(value) : String(value);
            } catch (e) {
                console.error('[Yma Cache] Serializer Error: ');
                console.error(e);
            }
        },
        parser: function (s) {
            const {json} = this;

            try {
                return json ? JSON.parse(s) : s;
            } catch (e) {
                console.error('[Yma Cache] Parser Error: ');
                console.error(e);

                return null;
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

export default function createStorage(key, options) {
    options = Object.assign({}, defaults(), options || {});

    const {onChange} = options;
    const parser = options.parser.bind(options);
    const serializer = options.serializer.bind(options);

    function get() {
        const jsonStr = localStorage.getItem(key);

        if (!jsonStr) {
            return null;
        }

        try {
            const cached = parser(jsonStr);
            if (cached.expires && Date.now() > cached.expires) {
                remove();

                return null;
            }

            return cached.value;
        } catch (e) {
            console.error('[Yma Cache] Error: ');
            console.error(e);
        }
    }

    function set(value, options = {}) {
        if (typeof options.expires === 'number') {
            let expires = options.expires,
                t = (options.expires = new Date());
            t.setTime(t.getTime() + expires);
        }

        const cached = {
            value: value,
            expires: options.expires ? options.expires : null,
        };
        localStorage.setItem(key, serializer(cached));

        const oldVal = get();
        if (!looseEqual(value, oldVal)) {
            onChange && onChange(value, oldVal, key);
        }

        return value;
    }

    function remove() {
        localStorage.removeItem(key);
    }

    return {
        get,
        set,
        remove,
    };
}
