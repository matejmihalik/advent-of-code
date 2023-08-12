// --- Day 16: Aunt Sue ---
// https://adventofcode.com/2015/day/16

import { InputReader } from '#src/InputReader.ts';

const PROFILES = new InputReader(import.meta.url).readAsLines();

type Criterion =
    | number
    | {
          sign: '<' | '>';
          value: number;
      };

type Criteria = Map<string, Criterion>;

type Profile = Map<string, number>;

type ProfileMap = Map<number, Profile>;

const PROFILE_MAP = PROFILES.reduce<ProfileMap>((profileMap, description) => {
    const descriptionMatch = description.match(/^Sue (?<profileId>\d+): (?<properties>.*)$/);

    if (!descriptionMatch?.groups) {
        return profileMap;
    }

    const { profileId, properties } = descriptionMatch.groups;

    const propertyMap = new Map(
        properties.split(', ').map((propertyString) => {
            const [name, value] = propertyString.split(': ');
            return [name, Number(value)];
        }),
    );

    profileMap.set(Number(profileId), propertyMap);

    return profileMap;
}, new Map());

function isNumber(criterion?: Criterion): criterion is number {
    return Number.isInteger(criterion);
}

function doesProfilePropertyMatchCriterion(propertyValue: number, criterion?: Criterion): boolean {
    if (isNumber(criterion)) {
        return propertyValue === criterion;
    }

    if (criterion?.sign === '<') {
        return propertyValue < criterion.value;
    }

    if (criterion?.sign === '>') {
        return propertyValue > criterion.value;
    }

    return true;
}

function doesProfileMatchCriteria(profile: Profile, criteria: Criteria): boolean {
    return Array.from(profile.entries()).every(([property, propertyValue]) =>
        doesProfilePropertyMatchCriterion(propertyValue, criteria.get(property)),
    );
}

function findProfileMatchingCriteria(targetCriteria: Criteria): number {
    const [targetProfileId = 0] =
        Array.from(PROFILE_MAP.entries()).find(([, profile]) =>
            doesProfileMatchCriteria(profile, targetCriteria),
        ) ?? [];
    return targetProfileId;
}

export function partOne(): number {
    const targetCriteria: Criteria = new Map(
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

    return findProfileMatchingCriteria(targetCriteria);
}

export function partTwo(): number {
    const targetCriteria: Criteria = new Map(
        Object.entries({
            akitas: 0,
            cars: 2,
            cats: { sign: '>', value: 7 },
            children: 3,
            goldfish: { sign: '<', value: 5 },
            perfumes: 1,
            pomeranians: { sign: '<', value: 3 },
            samoyeds: 2,
            trees: { sign: '>', value: 3 },
            vizslas: 0,
        }),
    );

    return findProfileMatchingCriteria(targetCriteria);
}
