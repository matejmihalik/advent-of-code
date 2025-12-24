import { EOL } from 'os';

export class ContentReader {
    #content: string;

    constructor(content: string) {
        this.#content = content;
    }

    readAsString(): string {
        return this.#content.trim();
    }

    readAsNumber(): number {
        return Number(this.readAsString());
    }

    readAsChars<T extends string>(): T[] {
        return this.readAsString().split('') as T[];
    }

    readAsComaSeparatedValues(): string[];
    readAsComaSeparatedValues<T>(transform: (value: string) => T): T[];
    readAsComaSeparatedValues<T>(transform?: (value: string) => T): string[] | T[] {
        const values = this.readAsString().split(',');

        if (transform) {
            return values.map(transform);
        }

        return values;
    }

    readAsLines(): string[];
    readAsLines<T>(transform: (line: string) => T): T[];
    readAsLines<T>(transform?: (line: string) => T): string[] | T[] {
        const lines = this.readAsString().split(EOL);

        if (transform) {
            return lines.map(transform);
        }

        return lines;
    }

    readAsUntrimmedLines(): string[] {
        return this.#content.trimEnd().split(EOL);
    }

    readAsNumbers(): number[] {
        return this.readAsLines(Number);
    }

    readAsGrid<T>(transform?: (cell: string) => T): T[][] {
        return this.readAsLines((row) => {
            const rowCells = row.split('');

            if (transform) {
                return rowCells.map(transform);
            }

            return rowCells as T[];
        });
    }
}
