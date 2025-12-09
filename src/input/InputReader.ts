import { readFileSync } from 'fs';
import { EOL } from 'os';
import { format, join } from 'path';

import { ContentReader } from './ContentReader';

const FILE_ENCODING = 'utf-8';

export class InputReader extends ContentReader {
    constructor(solutionDirectory: string) {
        const [, projectRoot, , year, day] = solutionDirectory.match(
            /(?<projectRoot>.*?)(?<folder>\w+)\/(?<year>\w+)\/(?<day>\w+)$/,
        ) ?? [];

        const inputFilePath = format({
            dir: join(projectRoot, 'input', year),
            name: day,
            ext: 'txt',
        });
        const inputFileContent = readFileSync(inputFilePath, FILE_ENCODING);
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
