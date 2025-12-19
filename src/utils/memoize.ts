export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result,
): (...args: Args) => Result {
    const cache = new Map<string, Result>();

    return (...args) => {
        const key = JSON.stringify(args);

        const cachedResult = cache.get(key);
        if (cachedResult) {
            return cachedResult;
        }

        const result = func(...args);
        cache.set(key, result);

        return result;
    };
}
