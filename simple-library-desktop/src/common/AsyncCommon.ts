export function startAsync() {
    return new Promise((resolve, reject) => resolve());
}


export function doAsync<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
    return new Promise(executor);
}