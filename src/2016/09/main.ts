// --- Day 9: Explosives in Cyberspace ---
// https://adventofcode.com/2016/day/9

import { InputReader } from '#src/InputReader.ts';

const COMPRESSED_FILE = new InputReader(import.meta.url).readAsString();

function calculateDecompressedFileLength(compressedFile: string, deepDecompress = false): number {
    let remainingCompressedFile = compressedFile;
    let decompressedFileLength = 0;

    while (remainingCompressedFile) {
        const currentMarkerMatch = remainingCompressedFile.match(
            /\((?<repeatedCharacters>\d+)x(?<repeatIterations>\d+)\)/,
        );

        if (!currentMarkerMatch?.groups) {
            decompressedFileLength += remainingCompressedFile.length;
            break;
        }

        const { repeatedCharacters, repeatIterations } = currentMarkerMatch.groups;
        const markerStartIndex = currentMarkerMatch.index ?? 0;
        const markerEndIndex =
            markerStartIndex + repeatedCharacters.length + repeatIterations.length + 3;

        const compressedSequence = remainingCompressedFile.slice(
            markerEndIndex,
            markerEndIndex + Number(repeatedCharacters),
        );
        const compressedSequenceLength = deepDecompress
            ? calculateDecompressedFileLength(compressedSequence, deepDecompress)
            : compressedSequence.length;
        const decompressedSequenceLength = compressedSequenceLength * Number(repeatIterations);

        decompressedFileLength += markerStartIndex + decompressedSequenceLength;
        remainingCompressedFile = remainingCompressedFile.slice(
            markerEndIndex + compressedSequence.length,
        );
    }

    return decompressedFileLength;
}

export function partOne(): number {
    return calculateDecompressedFileLength(COMPRESSED_FILE);
}

export function partTwo(): number {
    return calculateDecompressedFileLength(COMPRESSED_FILE, true);
}
