/* Your library */

const target = {
    debug: 'target', // <- just a helper, pretend this property is not here

    get upperCaseName() {
        if (this === target) console.log('  this === target');
        if (this === receiver) console.log('  this === receiver');

        return this.name.toUpperCase();
    },

    get name() {
        return 'mr. target';
    },
};

const proxy = new Proxy(target, {
    get(target, prop, receiver) {
        console.log(`Proxy.get(${prop})`);

        if (prop === 'directAccessUpperCaseName') {
            return target['upperCaseName'];
        }

        if (prop === 'reflectUpperCaseName') {
            return Reflect.get(target, 'upperCaseName', receiver);
        }

        throw new Error(`Property '${prop}' is not known`);
    },
});

/* My code using your library */

const receiver = Object.create(proxy);
Object.defineProperties(receiver, {
    name: {
        get() {
            return 'mrs. receiver';
        },
    },
});

console.log(`receiver.directAccessUpperCaseName = "${receiver.directAccessUpperCaseName}"`);
console.log(`receiver.reflectUpperCaseName = "${receiver.reflectUpperCaseName}"`);
