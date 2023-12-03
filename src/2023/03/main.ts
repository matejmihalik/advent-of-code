// --- Day 3: Gear Ratios ---
// https://adventofcode.com/2023/day/3

import { InputReader } from '#src/InputReader.ts';

const ENGINE_SCHEMATIC = new InputReader(import.meta.url).readAsLines();

type EngineSchematic = string[];

interface SchematicNumbers {
    value: number;
    row: number;
    startColumn: number;
    endColumn: number;
}

type SchematicCoordinates = [row: number, column: number];

type GearCandidateMap = Map<string, number[]>;

const PART_NUMBERS_ADJACENT_TO_GEAR = 2;

function findSchematicNumbers(schematic: EngineSchematic): SchematicNumbers[] {
    return schematic.reduce<SchematicNumbers[]>((schematicNumbers, row, rowIndex) => {
        Array.from(row.matchAll(/\d+/g)).forEach(({ 0: number, index: startColumn = 0 }) => {
            const endColumn = startColumn + number.length - 1;

            schematicNumbers.push({
                value: Number(number),
                row: rowIndex,
                startColumn,
                endColumn,
            });
        });

        return schematicNumbers;
    }, []);
}

function findAdjacentSymbols(
    schematic: EngineSchematic,
    row: number,
    startColumn: number,
    endColumn: number,
    symbolRegExp: RegExp,
): SchematicCoordinates[] {
    const globalSymbolRegExp = new RegExp(symbolRegExp.source, 'g');
    const previousColumn = startColumn - 1;
    const followingColumn = endColumn + 1;
    const safePreviousColumn = Math.max(previousColumn, 0);
    const safeFollowingColumn = Math.min(followingColumn, schematic[row].length - 1);

    const matches: SchematicCoordinates[] = [];

    const matchesAbove = schematic[row - 1]
        ?.slice(safePreviousColumn, safeFollowingColumn + 1)
        ?.matchAll(globalSymbolRegExp);
    Array.from(matchesAbove ?? []).forEach(({ index = 0 }) => {
        matches.push([row - 1, safePreviousColumn + index]);
    });

    const matchesBelow = schematic[row + 1]
        ?.slice(safePreviousColumn, safeFollowingColumn + 1)
        .matchAll(globalSymbolRegExp);
    Array.from(matchesBelow ?? []).forEach(({ index = 0 }) => {
        matches.push([row + 1, safePreviousColumn + index]);
    });

    const hasBeforeMatch = symbolRegExp.test(schematic[row][previousColumn] ?? '');
    if (hasBeforeMatch) {
        matches.push([row, previousColumn]);
    }

    const hasAfterMatch = symbolRegExp.test(schematic[row][followingColumn] ?? '');
    if (hasAfterMatch) {
        matches.push([row, followingColumn]);
    }

    return matches;
}

function findPartNumbers(schematic: EngineSchematic): number[] {
    return findSchematicNumbers(schematic).reduce<number[]>(
        (partNumbers, { value, row, startColumn, endColumn }) => {
            const symbolRegExp = /[^\d.]/;

            if (findAdjacentSymbols(schematic, row, startColumn, endColumn, symbolRegExp).length) {
                partNumbers.push(value);
            }

            return partNumbers;
        },
        [],
    );
}

export function partOne(): number {
    const partNumbers = findPartNumbers(ENGINE_SCHEMATIC);
    return partNumbers.reduce((sum, partNumber) => sum + partNumber, 0);
}

function buildGearCandidateMap(schematic: EngineSchematic): GearCandidateMap {
    return findSchematicNumbers(schematic).reduce<GearCandidateMap>(
        (gearCandidateMap, { value, row, startColumn, endColumn }) => {
            const gearSymbolRegExp = /[*]/;

            const adjacentGearCandidates = findAdjacentSymbols(
                schematic,
                row,
                startColumn,
                endColumn,
                gearSymbolRegExp,
            );

            adjacentGearCandidates.forEach((gearCandidateCoordinates) => {
                const serializedGearCandidateCoordinates = gearCandidateCoordinates.toString();

                if (!gearCandidateMap.has(serializedGearCandidateCoordinates)) {
                    gearCandidateMap.set(serializedGearCandidateCoordinates, []);
                }

                gearCandidateMap.get(serializedGearCandidateCoordinates)?.push(value);
            });

            return gearCandidateMap;
        },
        new Map(),
    );
}

function findValidGears(gearCandidateMap: GearCandidateMap): number[][] {
    return Array.from(gearCandidateMap.values()).filter(
        (adjacentPartNumbers) => adjacentPartNumbers.length === PART_NUMBERS_ADJACENT_TO_GEAR,
    );
}

function calculateGearRatio(adjacentPartNumbers: number[]): number {
    return adjacentPartNumbers.reduce((gearRatio, partNumber) => gearRatio * partNumber, 1);
}

export function partTwo(): number {
    const gearCandidateMap = buildGearCandidateMap(ENGINE_SCHEMATIC);
    const validGears = findValidGears(gearCandidateMap);

    return validGears.reduce((sum, gear) => sum + calculateGearRatio(gear), 0);
}
