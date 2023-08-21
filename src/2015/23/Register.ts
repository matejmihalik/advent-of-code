export class Register {
    #value;

    constructor(initialValue = 0) {
        this.#value = initialValue;
    }

    get value(): number {
        return this.#value;
    }

    set value(value: number) {
        this.#value = value;
    }
}
