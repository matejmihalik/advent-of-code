import { readFileSync } from 'fs';

import { ContentReader } from './ContentReader.ts';

const INPUT_FILENAME = 'input.txt';

export class InputReader extends ContentReader {
    constructor(solutionUrl: string) {
        const inputFilePath = new URL(INPUT_FILENAME, solutionUrl);
        const inputFileContent = readFileSync(inputFilePath, 'utf-8');
        super(inputFileContent);
    }

    readAsJson(): Record<string, unknown> {
        return JSON.parse(this.readAsString());
    }

    readAsSections(): ContentReader[] {
        return this.readAsString()
            .split('\n\n')
            .map((sectionContent) => new ContentReader(sectionContent));
    }
}
