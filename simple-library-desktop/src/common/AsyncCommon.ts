export function startAsync<T>(): Promise<T> {
    return new Promise((resolve, reject) => resolve());
}

export function startAsyncWithValue<T>(value: T): Promise<T> {
    return new Promise((resolve, reject) => resolve(value));
}

export function doAsync<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
    return new Promise(executor);
}

export function failedAsync<T>(error: string): Promise<T> {
    return new Promise((resolve, reject) => reject(error));
}

export function voidThen(): void {
    return undefined;
}
