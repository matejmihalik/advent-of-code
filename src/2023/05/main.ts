// --- Day 5: If You Give A Seed A Fertilizer ---
// https://adventofcode.com/2023/day/5

import { InputReader } from '#src/InputReader.ts';

const [RAW_SEED_LIST, ...CATEGORY_MAP_SECTIONS] = new InputReader(import.meta.url).readAsSections();

interface ValueRange {
    start: number;
    end: number;
}

interface MappingRange extends ValueRange {
    offset: number;
}

interface CategoryMap {
    sourceCategory: string;
    destinationCategory: string;
    ranges: MappingRange[];
}

const INITIAL_CATEGORY = 'seed';
const FINAL_CATEGORY = 'location';

const SEED_LIST =
    RAW_SEED_LIST.readAsString()
        .match(/\d+/g)
        ?.map((seedNumber) => Number(seedNumber)) ?? [];

function parseCategoryMapHeading(
    heading: string,
): Pick<CategoryMap, 'sourceCategory' | 'destinationCategory'> | null {
    const headingMatch = heading.match(
        /^(?<sourceCategory>\w+)-to-(?<destinationCategory>\w+) map:$/,
    );

    if (!headingMatch?.groups) {
        return null;
    }

    const { sourceCategory, destinationCategory } = headingMatch.groups;

    return {
        sourceCategory,
        destinationCategory,
    };
}

function parseCategoryMapRange(rawRange: string): MappingRange {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = rawRange.split(' ').map(Number);

    return {
        start: sourceRangeStart,
        end: sourceRangeStart + rangeLength - 1,
        offset: destinationRangeStart - sourceRangeStart,
    };
}

const CATEGORY_MAP_LIST = CATEGORY_MAP_SECTIONS.reduce<CategoryMap[]>(
    (categoryMapList, categoryMapSection) => {
        const [heading, ...ranges] = categoryMapSection.readAsLines();

        const parsedHeading = parseCategoryMapHeading(heading);

        if (!parsedHeading) {
            return categoryMapList;
        }

        categoryMapList.push({
            sourceCategory: parsedHeading.sourceCategory,
            destinationCategory: parsedHeading.destinationCategory,
            ranges: ranges.map(parseCategoryMapRange),
        });

        return categoryMapList;
    },
    [],
);

function getFirstRangeOverlapValue(firstRange: ValueRange, secondRange: ValueRange): number {
    return Math.max(firstRange.start, secondRange.start);
}

function findFirstOverlappingRange<T extends ValueRange>(
    targetRange: ValueRange,
    ranges: T[],
): T | null {
    return ranges.reduce<T | null>((firstOverlappingRange, currentRange) => {
        if (currentRange.end >= targetRange.start && currentRange.start <= targetRange.end) {
            const currentRangeOverlapValue = getFirstRangeOverlapValue(currentRange, targetRange);
            const firstOverlappingRangeOverlapValue = firstOverlappingRange
                ? getFirstRangeOverlapValue(firstOverlappingRange, targetRange)
                : Infinity;

            if (currentRangeOverlapValue < firstOverlappingRangeOverlapValue) {
                return currentRange;
            }
        }

        return firstOverlappingRange;
    }, null);
}

function adjustValueRangesToMappingRanges(
    valueRanges: ValueRange[],
    mappingRanges: MappingRange[],
): ValueRange[] {
    return valueRanges.reduce<ValueRange[]>((adjustedRanges, currentRange) => {
        const closestMappingRange = findFirstOverlappingRange(currentRange, mappingRanges);

        if (!closestMappingRange) {
            adjustedRanges.push(currentRange);
            return adjustedRanges;
        }

        if (currentRange.start < closestMappingRange.start) {
            const underflowRange = {
                start: currentRange.start,
                end: closestMappingRange.start - 1,
            };
            adjustedRanges.push(underflowRange);
        }

        const rangeOverlapEnd = Math.min(currentRange.end, closestMappingRange.end);
        const overlapRange = {
            start: currentRange.start + closestMappingRange.offset,
            end: rangeOverlapEnd + closestMappingRange.offset,
        };
        adjustedRanges.push(overlapRange);

        if (currentRange.end > closestMappingRange.end) {
            const overflowRange = {
                start: closestMappingRange.end + 1,
                end: currentRange.end,
            };
            adjustedRanges.push(
                ...adjustValueRangesToMappingRanges([overflowRange], mappingRanges),
            );
        }

        return adjustedRanges;
    }, []);
}

function mapRangesThroughCategories(
    sourceItemRanges: ValueRange[],
    sourceItemCategory: string,
    destinationItemCategory: string,
    categoryMapList: CategoryMap[],
): ValueRange[] {
    const categoryMap = categoryMapList.find(
        ({ sourceCategory }) => sourceCategory === sourceItemCategory,
    );

    if (!categoryMap) {
        return sourceItemRanges;
    }

    const adjustedRanges = adjustValueRangesToMappingRanges(sourceItemRanges, categoryMap.ranges);

    if (categoryMap.destinationCategory === destinationItemCategory) {
        return adjustedRanges;
    }

    return mapRangesThroughCategories(
        adjustedRanges,
        categoryMap.destinationCategory,
        destinationItemCategory,
        categoryMapList,
    );
}

function findLowestRangeValue(ranges: ValueRange[]): number {
    return ranges.reduce((lowestCategoryValue, categoryRange) => {
        if (categoryRange.start < lowestCategoryValue) {
            return categoryRange.start;
        }
        return lowestCategoryValue;
    }, Infinity);
}

export function partOne(): number {
    const singleSeedRanges = SEED_LIST.map((seedNumber) => ({
        start: seedNumber,
        end: seedNumber,
    }));

    const finalCategoryRanges = mapRangesThroughCategories(
        singleSeedRanges,
        INITIAL_CATEGORY,
        FINAL_CATEGORY,
        CATEGORY_MAP_LIST,
    );

    return findLowestRangeValue(finalCategoryRanges);
}

function constructItemPairs<T>(items: T[]): T[][] {
    return items.reduce<T[][]>((pairs, currentItem, currentItemIndex) => {
        if (currentItemIndex % 2 === 0) {
            pairs.push([currentItem]);
        } else {
            const pairIndex = Math.floor(currentItemIndex / 2);
            pairs[pairIndex].push(currentItem);
        }
        return pairs;
    }, []);
}

export function partTwo(): number {
    const seedRanges = constructItemPairs(
        RAW_SEED_LIST.readAsString().match(/\d+/g)?.map(Number) ?? [],
    ).map(([seedRangeStart, seedRangeLength]) => ({
        start: seedRangeStart,
        end: seedRangeStart + seedRangeLength - 1,
    }));

    const finalCategoryRanges = mapRangesThroughCategories(
        seedRanges,
        INITIAL_CATEGORY,
        FINAL_CATEGORY,
        CATEGORY_MAP_LIST,
    );

    return findLowestRangeValue(finalCategoryRanges);
}
