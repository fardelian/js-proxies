# new Proxy()

JavaScript proxies are one of my favorite toys.

They allow me to create all kinds of interesting stuff.

I haven't found a use for them yet and everything I build is impractical,
but it would be cool if they would be.

## Toys

I only have one toy available on GitHub at the moment, and I'm sure it won't compile
because I haven't tested it since 10 years ago, and it assumes all the property names
are  strings. Modern JS accesses some Symbol properties in some cases and that will
surely  break it. You should still check it out though.

### jostore

So I made [jostore](https://github.com/fardelian/jostore), a sort of database with full
versioning where you  call a function which gives you a root object as response, and then
you can access  that object and read and write properties on it. It supports immediate
values (numbers, strings), arrays and objects as property values. If a property value is
an object, then it is also configured to be a proxy. All read/write access is saved in
a rudimentary block database so stick to using property names and values which are less
than 900 bytes when stringified.

If you manage to run the example below multiple times, you will see the best database
in the world in action:

```javascript
const storeDirectory = require('path').resolve(__dirname, 'jostore-data');
const jostore = require('jostore');
const data = jostore(storeDirectory);

const key = Math.floor(Math.random() * 10);
data[key] = new Date().toISOString();

for (const i = 0; i < 10; i++) {
    console.log(`${i}: ${data[i]}`);
}
```

Q: Wait, `require()`? Why not `import`? 
A: Because I haven't touched this thing since 10 years ago. What did you expect?

Q: It doesn't work.
A: Use Node.js v4.x - 6.x

### trap-modes

The [trap-modes](./trap-modes) examples will explain the difference between `target[prop]` and `Reflect()`.

## Documentation

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
