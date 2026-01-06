const proxy = new Proxy({a: 1}, {
    get(target, prop) {
        return prop in target ? target[prop] : 37;
    }
});

proxy.b = 'second';

console.log(proxy.a, proxy.b, proxy.c, proxy.d); // 1, second, 37, 37
