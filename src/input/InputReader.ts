import { readFileSync } from 'fs';
import { EOL } from 'os';
import { format, join } from 'path';

import { ContentReader } from './ContentReader';

const INPUT_DIRECTORY = 'input';
const INPUT_EXTENSION = 'txt';
const INPUT_ENCODING = 'utf-8';

export class InputReader extends ContentReader {
    constructor(solutionDirectory: string) {
        const [, projectRoot, , year, day] = solutionDirectory.match(
            /(?<projectRoot>.*?)(?<sourceDirectory>\w+)\/(?<year>\w+)\/(?<day>\w+)$/,
        ) ?? [];

        const inputFilePath = format({
            dir: join(projectRoot, INPUT_DIRECTORY, year),
            name: day,
            ext: INPUT_EXTENSION,
        });
        const inputFileContent = readFileSync(inputFilePath, INPUT_ENCODING);
        super(inputFileContent);
    }

    readAsJson(): Record<string, unknown> {
        return JSON.parse(this.readAsString());
    }

    readAsSections(): ContentReader[] {
        return this.readAsString()
            .split(EOL + EOL)
            .map((sectionContent) => new ContentReader(sectionContent));
    }
}
