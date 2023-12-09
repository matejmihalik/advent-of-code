// --- Day 8: Haunted Wasteland ---
// https://adventofcode.com/2023/day/8

import { InputReader } from '#src/InputReader.ts';

const [INSTRUCTIONS_SECTION, NETWORK_SECTION] = new InputReader(import.meta.url).readAsSections();

interface Node {
    label: string;
    left?: Node;
    right?: Node;
}

type Network = Map<string, Node>;

const INSTRUCTIONS = INSTRUCTIONS_SECTION.readAsString();

const NETWORK = NETWORK_SECTION.readAsLines().reduce<Network>((network, rawNode) => {
    const nodeMatch = rawNode.match(
        /^(?<currentNode>\w+) = \((?<leftNode>\w+), (?<rightNode>\w+)\)$/,
    );

    if (!nodeMatch?.groups) {
        return network;
    }

    const { currentNode, leftNode, rightNode } = nodeMatch.groups;

    if (!network.has(currentNode)) {
        network.set(currentNode, { label: currentNode });
    }

    if (!network.has(leftNode)) {
        network.set(leftNode, { label: leftNode });
    }

    if (!network.has(rightNode)) {
        network.set(rightNode, { label: rightNode });
    }

    const currentNetworkNode = network.get(currentNode);

    if (currentNetworkNode) {
        currentNetworkNode.left = network.get(leftNode);
        currentNetworkNode.right = network.get(rightNode);
    }

    return network;
}, new Map());

function countStepsToTarget(
    initialNode: Node | undefined,
    hasReachedTarget: (node: Node) => boolean,
): number {
    if (!initialNode) {
        return 0;
    }

    let stepCount = 0;
    let currentNode = initialNode;

    while (!hasReachedTarget(currentNode)) {
        const currentInstruction = INSTRUCTIONS[stepCount % INSTRUCTIONS.length];

        if (currentInstruction === 'L') {
            currentNode = currentNode.left ?? currentNode;
        }

        if (currentInstruction === 'R') {
            currentNode = currentNode.right ?? currentNode;
        }

        stepCount++;
    }

    return stepCount;
}

export function partOne(): number {
    const initialNode = NETWORK.get('AAA');
    const finalNode = NETWORK.get('ZZZ');

    return countStepsToTarget(initialNode, (node) => node === finalNode);
}

function calculateGreatestCommonDivisor(numberA: number, numberB: number): number {
    if (!numberB) {
        return numberA;
    }

    return calculateGreatestCommonDivisor(numberB, numberA % numberB);
}

function calculateLeastCommonMultiple(numbers: number[]): number {
    return numbers.reduce(
        (leastCommonMultiple, currentNumber) =>
            (leastCommonMultiple * currentNumber) /
            calculateGreatestCommonDivisor(leastCommonMultiple, currentNumber),
        1,
    );
}

export function partTwo(): number {
    const initialNodes = Array.from(NETWORK.values()).filter(({ label }) => label.endsWith('A'));

    const stepCountsToTarget = initialNodes.map((initialNode) =>
        countStepsToTarget(initialNode, ({ label }) => label.endsWith('Z')),
    );

    return calculateLeastCommonMultiple(stepCountsToTarget);
}
