// --- Day 9: Movie Theater ---
// https://adventofcode.com/2025/day/9
// https://www.reddit.com/r/adventofcode/comments/1phywvn/2025_day_9_solutions/

import { InputReader } from '#src/input';

type Tile = [row: number, column: number];

function parseTile(rawTile: string): Tile {
    const [column, row] = rawTile.split(',').map(Number);
    return [row, column];
}

const RED_TILES = new InputReader(import.meta.dirname).readAsLines(parseTile);

export function partOne(): number {
    const processedTiles: [number, number][] = [];

    const [rowDistance, columnDistance] = RED_TILES.reduce<[number, number]>(
        ([maxRowDistance, maxColumnDistance], [tileRow, tileColumn]) => {
            const [localMaxRowDistance, localMaxColumnDistance] = processedTiles.reduce<[number, number]>(
                (
                    [processedMaxRowDistance, processedMaxColumnDistance],
                    [processedTileRow, processedTileColumn],
                ) => {
                    const processedTileRowDistance = Math.abs(processedTileRow - tileRow);
                    const processedTileColumnDistance = Math.abs(processedTileColumn - tileColumn);
                    const rowDistanceDelta = processedTileRowDistance - processedMaxRowDistance;
                    const columnDistanceDelta
                        = processedTileColumnDistance - processedMaxColumnDistance;

                    if (
                        (rowDistanceDelta > 0 && columnDistanceDelta > 0)
                        || (rowDistanceDelta > 0 && rowDistanceDelta > Math.abs(columnDistanceDelta))
                        || (columnDistanceDelta > 0 && columnDistanceDelta > Math.abs(rowDistanceDelta))
                    ) {
                        return [processedTileRowDistance, processedTileColumnDistance];
                    }

                    return [processedMaxRowDistance, processedMaxColumnDistance];
                },
                [0, 0],
            );

            processedTiles.push([tileRow, tileColumn]);

            const rowDistanceDelta = localMaxRowDistance - maxRowDistance;
            const columnDistanceDelta = localMaxColumnDistance - maxColumnDistance;

            if (
                (rowDistanceDelta > 0 && columnDistanceDelta > 0)
                || (rowDistanceDelta > 0 && rowDistanceDelta > Math.abs(columnDistanceDelta))
                || (columnDistanceDelta > 0 && columnDistanceDelta > Math.abs(rowDistanceDelta))
            ) {
                return [localMaxRowDistance, localMaxColumnDistance];
            }

            return [maxRowDistance, maxColumnDistance];
        },
        [0, 0],
    );

    return (rowDistance + 1) * (columnDistance + 1);
}

export function partTwo(): number {
    return 0;
}
