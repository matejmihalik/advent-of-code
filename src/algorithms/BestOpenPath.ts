import { memoize } from '#src/utils';

import type { Distance, DistanceFitnessFunction, Edge, Graph, Node } from './Graph';

export class BestOpenPath {
    #graph: Graph;
    #fitnessFunction: DistanceFitnessFunction;

    constructor(graph: Graph, fitnessFunction: DistanceFitnessFunction) {
        this.#graph = graph;
        this.#fitnessFunction = fitnessFunction;
    }

    #getEdge(nodeA: Node, nodeB: Node): Edge {
        return this.#graph.get(nodeA)?.get(nodeB) ?? 0;
    }

    #findBestSubDistance = memoize(
        (nodes: Node[], originNode?: Node): Distance =>
            nodes.reduce<Distance | null>((bestSubDistance, currentNode, currentNodeIndex) => {
                const remainingNodes = nodes.toSpliced(currentNodeIndex, 1);

                const distanceFromOrigin = originNode ? this.#getEdge(originNode, currentNode) : 0;

                if (!remainingNodes.length) {
                    return distanceFromOrigin;
                }

                const bestRemainingDistance = this.#findBestSubDistance(
                    remainingNodes,
                    currentNode,
                );

                const currentSubDistance = distanceFromOrigin + bestRemainingDistance;

                if (bestSubDistance === null) {
                    return currentSubDistance;
                }

                if (
                    this.#fitnessFunction(currentSubDistance)
                    > this.#fitnessFunction(bestSubDistance)
                ) {
                    return currentSubDistance;
                }

                return bestSubDistance;
            }, null) ?? 0,
    );

    findBestDistance(): Distance {
        const allNodes = Array.from(this.#graph.keys());
        return this.#findBestSubDistance(allNodes);
    }
}
