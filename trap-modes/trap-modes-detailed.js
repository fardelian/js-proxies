/* Debug helpers */

// prevent stack overflow in the proxy
const MAX_STACK_DEPTH = 10;
let currentStackDepth;

// magic
const TRAP_MODES = {
    accessTarget: 'target[prop]',
    accessReceiver: 'receiver[prop]',
    reflect: 'Reflect()',
}
let currentTrapMode;

// logging
let logDepth = 0;
const beginLog = (message) => console.log(`${'  '.repeat(logDepth++)}${message}`);
const endLog = () => logDepth--;

/* Your library */

const target = {
    debug: 'target', // <- just a helper, pretend this property is not here

    get fullName() {
        beginLog(`get target.fullName, this === ${this.debug}`);
        const firstName = this.firstName;
        const middleName = this.middleName;
        const lastName = this.lastName;
        endLog();
        return `${firstName} ${middleName} ${lastName}`;
    },
    get firstName() {
        beginLog(`get target.firstName, this === ${this.debug}`);
        endLog();
        return 'targetFirstName';
    },
    get middleName() {
        beginLog(`get target.middleName, this === ${this.debug}`);
        endLog();
        return 'targetMiddleName';
    },
    get lastName() { // <- just a helper, pretend this getter is not here
        beginLog(`get target.lastName, this === ${this.debug}, but pretend that target.lastName is not defined`);
        endLog();
        return undefined;
    },
};

const proxy = new Proxy(target, {
    get(target, prop, receiver) {
        if (prop === 'debug') return proxy; // ignore this
        beginLog(`get proxy.${prop}, this === ${this.debug}`);

        if (currentStackDepth++ > MAX_STACK_DEPTH) {
            console.error(`Call stack exceeded, the application would crash here...`);
            endLog();
            return 'Error';
        }

        let result;
        switch (currentTrapMode) {
            case TRAP_MODES.accessTarget:
                result = target[prop];
                break;
            case TRAP_MODES.accessReceiver:
                result = receiver[prop];
                break;
            case TRAP_MODES.reflect:
                result = Reflect.get(target, prop, receiver);
                break;
            default:
                throw new Error('idk what to do in this trap mode');
        }
        endLog();

        return `proxy(${result})`;
    }
});

/* My code using your library */

const receiver = Object.create(proxy);
Object.defineProperties(receiver, {
    debug: {value: 'receiver'}, // <- helper
    firstName: {
        get() {
            beginLog(`get receiver.firstName, this === ${this.debug}`);
            endLog();

            return 'receiverFirstName';
        },
    },
});

for (const tm in TRAP_MODES) {
    currentTrapMode = TRAP_MODES[tm];
    currentStackDepth = 0;

    beginLog(`When trapMode is ${currentTrapMode}:`);
    const fullName = receiver.fullName;
    console.log(`Then receiver.fullName = "${fullName}"\n\n`);
    endLog();
}
