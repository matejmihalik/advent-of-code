// --- Day 7: Some Assembly Required ---
// https://adventofcode.com/2015/day/7

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

type Circuit = Map<string, string>;

const OUTPUT_WIRE = 'a';

function createCircuit(): Circuit {
    return new Map();
}

function connectWire(circuit: Circuit, instruction: string): void {
    const match = instruction.match(/^(?<signal>.*) -> (?<wire>[a-z]+)$/);

    if (!match?.groups) {
        return;
    }

    const {
        groups: { signal, wire },
    } = match;
    circuit.set(wire, signal);
}

function evaluateSignal(circuit: Circuit, signal: string): number {
    return Number(signal) || traceWire(circuit, signal);
}

function traceWire(circuit: Circuit, wire: string): number {
    const signal = circuit.get(wire);

    if (!signal) {
        return 0;
    }

    const andGateMatch = signal.match(/^(?<signalA>\w+) AND (?<signalB>\w+)$/);
    if (andGateMatch?.groups) {
        const { signalA, signalB } = andGateMatch.groups;
        const resultingSignal = evaluateSignal(circuit, signalA) & evaluateSignal(circuit, signalB);
        circuit.set(wire, resultingSignal.toString());
        return resultingSignal;
    }

    const orGateMatch = signal.match(/^(?<signalA>\w+) OR (?<signalB>\w+)$/);
    if (orGateMatch?.groups) {
        const { signalA, signalB } = orGateMatch.groups;
        const resultingSignal = evaluateSignal(circuit, signalA) | evaluateSignal(circuit, signalB);
        circuit.set(wire, resultingSignal.toString());
        return resultingSignal;
    }

    const leftShiftGateMatch = signal.match(/^(?<signalA>\w+) LSHIFT (?<signalB>\w+)$/);
    if (leftShiftGateMatch?.groups) {
        const { signalA, signalB } = leftShiftGateMatch.groups;
        const resultingSignal =
            evaluateSignal(circuit, signalA) << evaluateSignal(circuit, signalB);
        circuit.set(wire, resultingSignal.toString());
        return resultingSignal;
    }

    const rightShiftGateMatch = signal.match(/^(?<signalA>\w+) RSHIFT (?<signalB>\w+)$/);
    if (rightShiftGateMatch?.groups) {
        const { signalA, signalB } = rightShiftGateMatch.groups;
        const resultingSignal =
            evaluateSignal(circuit, signalA) >> evaluateSignal(circuit, signalB);
        circuit.set(wire, resultingSignal.toString());
        return resultingSignal;
    }

    const notShiftGateMatch = signal.match(/^NOT (?<negatedSignal>\w+)$/);
    if (notShiftGateMatch?.groups) {
        const { negatedSignal } = notShiftGateMatch.groups;
        const resultingSignal = ~evaluateSignal(circuit, negatedSignal);
        circuit.set(wire, resultingSignal.toString());
        return resultingSignal;
    }

    return evaluateSignal(circuit, signal);
}

function followInstructions(circuit: Circuit): void {
    INSTRUCTIONS.forEach((instruction) => connectWire(circuit, instruction));
}

export function partOne(): number {
    const circuit = createCircuit();

    followInstructions(circuit);

    return traceWire(circuit, OUTPUT_WIRE);
}

export function partTwo(): number {
    const overriddenWire = 'b';
    const circuit = createCircuit();
    const originalOutputSignal = partOne();

    followInstructions(circuit);
    connectWire(circuit, `${originalOutputSignal} -> ${overriddenWire}`);

    return traceWire(circuit, OUTPUT_WIRE);
}
