export function partition<T>(
    array: T[],
    predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
    return array.reduce<[T[], T[]]>(
        ([truthyResults, falsyResults], item, index) => {
            if (predicate(item, index)) {
                truthyResults.push(item);
            } else {
                falsyResults.push(item);
            }

            return [truthyResults, falsyResults];
        },
        [[], []],
    );
}
