// --- Day 8: Playground ---
// https://adventofcode.com/2025/day/8
// https://www.reddit.com/r/adventofcode/comments/1ph3tfc/2025_day_8_solutions/

import { InputReader } from '#src/input';

type JunctionBox = [x: number, y: number, z: number];

function parseJunctionBox(rawJunctionBox: string): JunctionBox {
    const [x, y, z] = rawJunctionBox.split(',').map(Number);
    return [x, y, z];
}

const JUNCTION_BOXES = new InputReader(import.meta.dirname).readAsLines(parseJunctionBox);

function calculateDistance([xA, yA, zA]: JunctionBox, [xB, yB, zB]: JunctionBox): number {
    return Math.sqrt(((xA - xB) ** 2) + ((yA - yB) ** 2) + ((zA - zB) ** 2));
}

const DISTANCES = JUNCTION_BOXES.reduce((distanceMap, outerJunctionBox, outerJunctionBoxIndex) => {
    const innerJunctionBoxes = JUNCTION_BOXES.slice(outerJunctionBoxIndex + 1);

    innerJunctionBoxes.forEach((innerJunctionBox, innerJunctionBoxIndex) => {
        const distance = calculateDistance(outerJunctionBox, innerJunctionBox);
        distanceMap.set(
            distance,
            [outerJunctionBoxIndex, outerJunctionBoxIndex + innerJunctionBoxIndex + 1],
        );
    });

    return distanceMap;
}, new Map());

export function partOne(): number {
    const shortestDistances = Array.from(DISTANCES.keys()).sort((a, b) => a - b).slice(0, 1000);
    const circuits: number[][] = [];

    shortestDistances.forEach((distance) => {
        const [boxA, boxB] = DISTANCES.get(distance);
        const boxACircuitIndex = circuits.findIndex((circuit) => circuit.includes(boxA));
        const boxACircuit = circuits[boxACircuitIndex];
        const boxBCircuitIndex = circuits.findIndex((circuit) => circuit.includes(boxB));
        const boxBCircuit = circuits[boxBCircuitIndex];

        if (boxACircuit && boxBCircuit) {
            if (boxACircuitIndex !== boxBCircuitIndex) {
                boxACircuit.push(...boxBCircuit);
                circuits.splice(boxBCircuitIndex, 1);
            }
            return;
        }

        if (boxACircuit) {
            boxACircuit.push(boxB);
            return;
        }

        if (boxBCircuit) {
            boxBCircuit.push(boxA);
            return;
        }

        circuits.push([boxA, boxB]);
    });

    const circuitLengths = circuits.map((circuit) => circuit.length);
    const [circuitALength, circuitBLength, circuitCLength] = circuitLengths.sort((a, b) => b - a);

    return circuitALength * circuitBLength * circuitCLength;
}

export function partTwo(): number {
    const shortestDistances = Array.from(DISTANCES.keys()).sort((a, b) => a - b);
    const circuits: number[][] = [];

    const finalDistance = shortestDistances.find((distance) => {
        const [boxA, boxB] = DISTANCES.get(distance);
        const boxACircuitIndex = circuits.findIndex((circuit) => circuit.includes(boxA));
        const boxACircuit = circuits[boxACircuitIndex];
        const boxBCircuitIndex = circuits.findIndex((circuit) => circuit.includes(boxB));
        const boxBCircuit = circuits[boxBCircuitIndex];

        if (boxACircuit && boxBCircuit) {
            if (boxACircuitIndex !== boxBCircuitIndex) {
                boxACircuit.push(...boxBCircuit);
                circuits.splice(boxBCircuitIndex, 1);
            }
        } else if (boxACircuit) {
            boxACircuit.push(boxB);
        } else if (boxBCircuit) {
            boxBCircuit.push(boxA);
        } else {
            circuits.push([boxA, boxB]);
        }

        return circuits.length === 1 && circuits[0].length === JUNCTION_BOXES.length;
    });

    const [finalBoxA, finalBoxB] = DISTANCES.get(finalDistance);

    return JUNCTION_BOXES[finalBoxA][0] * JUNCTION_BOXES[finalBoxB][0];
}
