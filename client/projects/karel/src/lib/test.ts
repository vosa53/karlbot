export class A {
    say() {
        console.log("Hello from A");
    }

    toB() {
        return new B();
    }
}

export class B {
    say() {
        console.log("Hello from B");
    }

    toA() {
        return new A();
    }
}