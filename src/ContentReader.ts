export class ContentReader {
    #content: string;

    constructor(content: string) {
        this.#content = content;
    }

    readAsString(): string {
        return this.#content.trim();
    }

    readAsChars(): string[] {
        return this.readAsString().split('');
    }

    readAsLines(): string[] {
        return this.readAsString().split('\n');
    }

    readAsNumbers(): number[] {
        return this.readAsLines().map(Number);
    }
}
