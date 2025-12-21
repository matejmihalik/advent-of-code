import { memoize } from '#src/utils';

import type { Distance, DistanceFitnessFunction, Edge, Graph, Node } from './Graph';

export class HeldKarp {
    #graph: Graph;
    #fitnessFunction: DistanceFitnessFunction;

    constructor(graph: Graph, fitnessFunction: DistanceFitnessFunction) {
        this.#graph = graph;
        this.#fitnessFunction = fitnessFunction;
    }

    #getPathEdges(path: Node[], isClosed: boolean): Edge[] {
        const edges = path.map((node, nodeIndex) => {
            const nextNode = path[nodeIndex + 1] ?? path[0];
            return this.#graph.get(node)?.get(nextNode) ?? 0;
        });

        if (isClosed) {
            return edges;
        }

        edges.splice(-1);
        return edges;
    }

    #calculatePathDistance(path: Node[], isClosed: boolean): Distance {
        const pathEdges = this.#getPathEdges(path, isClosed);
        return pathEdges.reduce((distance, edge) => distance + edge, 0);
    }

    #findBestSubPath = memoize(
        (nodes: Node[], originNode: Node, destinationNode: Node): Node[] =>
            nodes.reduce<Node[] | null>((bestSubPath, currentNode, currentNodeIndex) => {
                const remainingNodes = nodes.toSpliced(currentNodeIndex, 1);

                if (!remainingNodes.length) {
                    return [currentNode];
                }

                const bestRemainingPath = this.#findBestSubPath(
                    remainingNodes,
                    currentNode,
                    destinationNode,
                );

                const currentSubPath = [currentNode, ...bestRemainingPath];

                if (!bestSubPath) {
                    return currentSubPath;
                }

                const currentFullPath = [originNode, ...currentSubPath, destinationNode];
                const currentPathDistance = this.#calculatePathDistance(currentFullPath, false);

                const bestFullPath = [originNode, ...bestSubPath, destinationNode];
                const bestPathDistance = this.#calculatePathDistance(bestFullPath, false);

                if (
                    this.#fitnessFunction(currentPathDistance)
                    > this.#fitnessFunction(bestPathDistance)
                ) {
                    return currentSubPath;
                }

                return bestSubPath;
            }, null) ?? [],
    );

    #findBestPath(): Node[] {
        const [firstNode, ...remainingNodes] = Array.from(this.#graph.keys());
        return [firstNode, ...this.#findBestSubPath(remainingNodes, firstNode, firstNode)];
    }

    findBestDistance(): Distance {
        const bestPath = this.#findBestPath();
        return this.#calculatePathDistance(bestPath, true);
    }
}
