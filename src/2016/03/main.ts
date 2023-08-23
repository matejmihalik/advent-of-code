// --- Day 3: Squares With Three Sides ---
// https://adventofcode.com/2016/day/3

import { InputReader } from '#src/InputReader.ts';

const RAW_TRIANGLES = new InputReader(import.meta.url).readAsLines();

type Triangle = number[];

function parseTrianglesByRows(rawTriangles: string[]): Triangle[] {
    return rawTriangles.reduce<Triangle[]>((triangles, rawTriangle) => {
        const rawTriangleMatch = rawTriangle.match(/\d+/g);

        if (!rawTriangleMatch) {
            return triangles;
        }

        const currentTriangle = rawTriangleMatch.map(Number);
        triangles.push(currentTriangle);

        return triangles;
    }, []);
}

function isValidTriangle(sides: Triangle): boolean {
    return sides.every((currentSide, currentSideIndex) => {
        const otherSides = [...sides];
        otherSides.splice(currentSideIndex, 1);
        return currentSide < otherSides.reduce((sum, side) => sum + side, 0);
    });
}

export function partOne(): number {
    const triangles = parseTrianglesByRows(RAW_TRIANGLES);
    const validTriangles = triangles.filter(isValidTriangle);

    return validTriangles.length;
}

function parseTrianglesByColumns(rawTriangles: string[]): Triangle[] {
    const triangles: Triangle[] = [];
    const triangleRegExp = /\d+/g;

    for (let rowIterator = 0; rowIterator < rawTriangles.length; rowIterator += 3) {
        const rowA = rawTriangles[rowIterator].match(triangleRegExp)?.map(Number);
        const rowB = rawTriangles[rowIterator + 1].match(triangleRegExp)?.map(Number);
        const rowC = rawTriangles[rowIterator + 2].match(triangleRegExp)?.map(Number);

        if (!rowA || !rowB || !rowC) {
            continue;
        }

        triangles.push([rowA[0], rowB[0], rowC[0]]);
        triangles.push([rowA[1], rowB[1], rowC[1]]);
        triangles.push([rowA[2], rowB[2], rowC[2]]);
    }

    return triangles;
}

export function partTwo(): number {
    const triangles = parseTrianglesByColumns(RAW_TRIANGLES);
    const validTriangles = triangles.filter(isValidTriangle);

    return validTriangles.length;
}
