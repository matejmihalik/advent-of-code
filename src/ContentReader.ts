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

    readAsComaSeparatedValues(): string[] {
        return this.readAsString().split(', ');
    }

    readAsLines(): string[] {
        return this.readAsString().split('\n');
    }

    readAsNumber(): number {
        return Number(this.readAsString());
    }

    readAsNumbers(): number[] {
        return this.readAsLines().map(Number);
    }
}
