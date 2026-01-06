# trap-modes

A `Proxy()` wraps around a target object and allows you to set trap functions
for the target's properties. You can see these functions as "middlemen" which
can return whatever they want (they don't even need to talk to the target).

## Long example

```javascript
// ./long-exmaple.js
const handler = {
    get(target, prop, receiver) {
        return Reflect.has(receiver, prop)
            ? Reflect.get(target, prop, receiver)
            : 37;
    },
    set(target, prop, value, receiver) {
        if (prop === 'blah') {
            return false;
        }
        return Reflect.set(target, prop, value, receiver);
    }
};

const proxy = new Proxy({}, handler);

proxy.a = 123;
console.log(proxy.a); // 123

proxy.b = undefined;
console.log(proxy.b); // undefined

console.log('c' in proxy, proxy.c); // false, 37

proxy.blah = 'hello';
console.log('blah' in proxy, proxy.blah); // false, 37
```

## Important

Most implementation **wrongfully** access `target[prop]`.

If, for some reason, you want to isolate everything that happens in `target`, that's fine.
Maybe you want to just keep everything private and prevent users from changing your Proxy's behavior.
You shouldn't do this, but you should know you can.

The problem is that this breaks JavaScript standards and it can cause undesired results.
If your Proxy is used as a constructor or is part of a prototype chain, a parent object may want to
change the Proxy's behavior by changing a property it needs to access.

In short, calling `Reflect.()` functions allows you to declare which value will be used as `this`
in getters and setters.

See [trap-modes-simple.js](trap-modes-simple.js) and [trap-modes-detailed.js](trap-modes-detailed.js).
Both files explain the same thing. The simple one has simple code and simple output. The detailed one
has much more complex code (including bells and whistles) but it has a very detailed output and covers
three cases.
