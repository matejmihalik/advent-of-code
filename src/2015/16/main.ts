// --- Day 16: Aunt Sue ---
// https://adventofcode.com/2015/day/16
// https://www.reddit.com/r/adventofcode/comments/3x1i26/day_16_solutions

import { InputReader } from '#src/input';

enum Comparison {
    Fewer = '<',
    Greater = '>',
}

type Profile = Map<string, number>;

type SearchCriterion
    = number | {
        comparison: Comparison;
        value: number;
    };

type SearchCriteria = Map<string, SearchCriterion>;

const POSSESSION_SEPARATOR = ', ';
const POSSESSION_QUANTITY_SEPARATOR = ': ';

function parsePossessionQuantities(
    possessionQuantities: string,
): [possession: string, quantity: number][] {
    return possessionQuantities.split(POSSESSION_SEPARATOR).map((possessionQuantity) => {
        const [possession, quantity] = possessionQuantity.split(POSSESSION_QUANTITY_SEPARATOR);
        return [possession, Number(quantity)];
    });
}

function parseProfile(profile: string): Profile {
    const [, possessionQuantities]
        = profile.match(/^Sue \d+: (?<possessionQuantities>.*)$/) ?? [];

    return new Map(parsePossessionQuantities(possessionQuantities));
}

const PROFILES = new InputReader(import.meta.dirname).readAsLines(parseProfile);

function isNumber(criterion: SearchCriterion): criterion is number {
    return Number.isInteger(criterion);
}

function doesProfilePropertyMatchSearchCriterion(
    propertyValue: number,
    criterion: SearchCriterion,
): boolean {
    if (isNumber(criterion)) {
        return propertyValue === criterion;
    }

    if (criterion.comparison === Comparison.Fewer) {
        return propertyValue < criterion.value;
    }

    if (criterion.comparison === Comparison.Greater) {
        return propertyValue > criterion.value;
    }

    return true;
}

function doesProfileMatchSearchCriteria(profile: Profile, searchCriteria: SearchCriteria): boolean {
    return profile.entries().every(([possession, quantity]) => {
        const searchCriterion = searchCriteria.get(possession);

        if (searchCriterion === undefined) {
            return true;
        }

        return doesProfilePropertyMatchSearchCriterion(quantity, searchCriterion);
    });
}

function findProfileIdMatchingSearchCriteria(searchCriteria: SearchCriteria): number {
    const matchingProfileIndex
        = PROFILES.findIndex((profile) => doesProfileMatchSearchCriteria(profile, searchCriteria));
    return matchingProfileIndex + 1;
}

export function partOne(): number {
    const searchCriteria: SearchCriteria = new Map(
        Object.entries({
            akitas: 0,
            cars: 2,
            cats: 7,
            children: 3,
            goldfish: 5,
            perfumes: 1,
            pomeranians: 3,
            samoyeds: 2,
            trees: 3,
            vizslas: 0,
        }),
    );

    return findProfileIdMatchingSearchCriteria(searchCriteria);
}

export function partTwo(): number {
    const targetCriteria: SearchCriteria = new Map(
        Object.entries({
            akitas: 0,
            cars: 2,
            cats: {
                comparison: Comparison.Greater,
                value: 7,
            },
            children: 3,
            goldfish: {
                comparison: Comparison.Fewer,
                value: 5,
            },
            perfumes: 1,
            pomeranians: {
                comparison: Comparison.Fewer,
                value: 3,
            },
            samoyeds: 2,
            trees: {
                comparison: Comparison.Greater,
                value: 3,
            },
            vizslas: 0,
        }),
    );

    return findProfileIdMatchingSearchCriteria(targetCriteria);
}
