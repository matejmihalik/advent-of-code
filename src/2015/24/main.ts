// --- Day 24: It Hangs in the Balance ---
// https://adventofcode.com/2015/day/24

import { InputReader } from '#src/InputReader.ts';

const PACKAGES = new InputReader(import.meta.url).readAsNumbers();

function findAllPackageCombinationsForSingleCompartment(
    packages: number[],
    compartmentCapacity: number,
): number[][] {
    return packages.reduce<number[][]>(
        (existingCombinations, currentPackage, currentContainerIndex) => {
            const otherPackages = packages.slice(currentContainerIndex + 1);

            if (currentPackage === compartmentCapacity) {
                return [...existingCombinations, [currentPackage]];
            }

            if (currentPackage > compartmentCapacity) {
                return existingCombinations;
            }

            const discoveredCombinations = findAllPackageCombinationsForSingleCompartment(
                otherPackages,
                compartmentCapacity - currentPackage,
            ).map((combination) => [currentPackage, ...combination]);

            return [...existingCombinations, ...discoveredCombinations];
        },
        [],
    );
}

function findIdealPassengerCompartmentArrangements(compartmentCount: number): number[][] {
    const totalPackageWeight = PACKAGES.reduce(
        (totalWeight, packageWeight) => totalWeight + packageWeight,
        0,
    );
    const compartmentCapacity = totalPackageWeight / compartmentCount;

    const combinations = findAllPackageCombinationsForSingleCompartment(
        PACKAGES,
        compartmentCapacity,
    );

    return combinations.reduce<number[][]>((idealCombinations, currentCombination) => {
        const currentIdealCombinationPackageCount = idealCombinations[0]?.length || Infinity;

        if (currentCombination.length < currentIdealCombinationPackageCount) {
            return [currentCombination];
        }

        if (currentCombination.length === currentIdealCombinationPackageCount) {
            idealCombinations.push(currentCombination);
        }

        return idealCombinations;
    }, []);
}

function calculateQuantumEntanglement(packages: number[]): number {
    return packages.reduce(
        (partialQuantumEntanglement, currentPackage) => partialQuantumEntanglement * currentPackage,
        1,
    );
}

function findMinimalQuantumEntanglement(compartmentCount: number): number {
    const idealArrangements = findIdealPassengerCompartmentArrangements(compartmentCount);
    const quantumEntanglements = idealArrangements.map(calculateQuantumEntanglement);

    return Math.min(...quantumEntanglements);
}

export function partOne(): number {
    const compartmentCount = 3;
    return findMinimalQuantumEntanglement(compartmentCount);
}

export function partTwo(): number {
    const compartmentCount = 4;
    return findMinimalQuantumEntanglement(compartmentCount);
}
