export function conditionalCount<T>(items: T[], predicate = (item: T) => Boolean(item)): number {
    return items.filter(predicate).length;
}
