import { readFileSync } from 'fs';

const INPUT_FILENAME = 'input.txt';

export class InputReader {
    fileBuffer: string;

    constructor(solutionUrl: string) {
        const fileUrl = new URL(INPUT_FILENAME, solutionUrl);
        this.fileBuffer = readFileSync(fileUrl, 'utf-8');
    }

    readAsString(): string {
        return this.fileBuffer.toString().trim();
    }

    readAsChars(): string[] {
        return this.readAsString().split('');
    }

    readAsLines(): string[] {
        return this.readAsString().split('\n');
    }
}
