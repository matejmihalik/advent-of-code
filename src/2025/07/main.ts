// --- Day 7: Laboratories ---
// https://adventofcode.com/2025/day/7
// https://www.reddit.com/r/adventofcode/comments/1pg9w66/2025_day_7_solutions/

import { InputReader } from '#src/input';
import { pairUnsigned, unpairUnsigned } from '#src/utils';

type Coordinates = [row: number, column: number];

type Manifold = string[][];

const STARTING_SYMBOL = 'S';
const SPLITTER_SYMBOL = '^';

let SPLIT_COUNTER = 0;
let TIMELINE_COUNTER = 0;
const BEAM_TIMELINES = new Map();

const MANIFOLD = new InputReader(import.meta.dirname).readAsGrid<string>();

function findStartingPosition(manifold: Manifold): Coordinates {
    const rowIndex = manifold.findIndex((row) => row.includes(STARTING_SYMBOL));
    const columnIndex = manifold[rowIndex].indexOf(STARTING_SYMBOL);

    return [rowIndex, columnIndex];
}

function isBeamInsideManifold(manifold: Manifold, [beamRow, beamColumn]: Coordinates) {
    const manifoldHeight = manifold.length;
    const manifoldWidth = manifold[0].length;

    return beamRow >= 0 && beamRow < manifoldHeight
        && beamColumn >= 0 && beamColumn < manifoldWidth;
}

function projectBeams1(manifold: Manifold, beams: Set<number>): Set<number> {
    const updatedBeams = new Set<number>();

    beams.forEach((beam) => {
        const [beamRow, beamColumn] = unpairUnsigned(beam);
        const projectedBeamRow = beamRow + 1;

        if (!isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn])) {
            return;
        }

        if (manifold[projectedBeamRow][beamColumn] === SPLITTER_SYMBOL) {
            SPLIT_COUNTER++;
            if (isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn - 1])) {
                updatedBeams.add(pairUnsigned([projectedBeamRow, beamColumn - 1]));
            }

            if (isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn + 1])) {
                updatedBeams.add(pairUnsigned([projectedBeamRow, beamColumn + 1]));
            }
        } else {
            updatedBeams.add(pairUnsigned([projectedBeamRow, beamColumn]));
        }
    });

    return updatedBeams;
}

export function partOne(): number {
    const startingBeam = findStartingPosition(MANIFOLD);
    let beams = new Set([pairUnsigned(startingBeam)]);

    while (beams.size) {
        beams = projectBeams1(MANIFOLD, beams);
    }

    return SPLIT_COUNTER;
}

function projectBeams2(manifold: Manifold, beams: Set<number>): Set<number> {
    const updatedBeams = new Set<number>();

    beams.forEach((beam) => {
        const [beamRow, beamColumn] = unpairUnsigned(beam);
        const beamTimelines = BEAM_TIMELINES.get(beam) ?? 0;
        const projectedBeamRow = beamRow + 1;

        if (!isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn])) {
            TIMELINE_COUNTER += beamTimelines;
            return;
        }

        if (manifold[projectedBeamRow][beamColumn] === SPLITTER_SYMBOL) {
            if (isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn - 1])) {
                const leftSideBeam = pairUnsigned([projectedBeamRow, beamColumn - 1]);
                const leftSideBeamTimelines = BEAM_TIMELINES.get(leftSideBeam) ?? 0;
                BEAM_TIMELINES.set(leftSideBeam, leftSideBeamTimelines + beamTimelines);
                updatedBeams.add(leftSideBeam);
            }

            if (isBeamInsideManifold(manifold, [projectedBeamRow, beamColumn + 1])) {
                const rightSideBeam = pairUnsigned([projectedBeamRow, beamColumn + 1]);
                const rightSideBeamTimelines = BEAM_TIMELINES.get(rightSideBeam) ?? 0;
                BEAM_TIMELINES.set(rightSideBeam, rightSideBeamTimelines + beamTimelines);
                updatedBeams.add(rightSideBeam);
            }
        } else {
            const continuousBeam = pairUnsigned([projectedBeamRow, beamColumn]);
            const continuousBeamTimelines = BEAM_TIMELINES.get(continuousBeam) ?? 0;
            BEAM_TIMELINES.set(continuousBeam, continuousBeamTimelines + beamTimelines);
            updatedBeams.add(continuousBeam);
        }
    });

    return updatedBeams;
}

export function partTwo(): number {
    const startingBeamCoordinates = findStartingPosition(MANIFOLD);
    const startingBeam = pairUnsigned(startingBeamCoordinates);
    let beams = new Set([startingBeam]);
    BEAM_TIMELINES.set(startingBeam, 1);

    while (beams.size) {
        beams = projectBeams2(MANIFOLD, beams);
    }

    return TIMELINE_COUNTER;
}
