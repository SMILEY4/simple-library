export interface Result {
    successful: boolean,
    errors: string[],
    payload?: any
}

export function errorResult(errors: string[], payload?: any): Result {
    return {
        successful: false,
        errors: errors,
        payload: payload,
    };
}

export function successResult(payload?: any): Result {
    return {
        successful: true,
        errors: undefined,
        payload: payload,
    };
}