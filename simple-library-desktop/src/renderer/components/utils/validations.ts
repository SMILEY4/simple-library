export function validateNotEmpty(value: string, error?: string): string | null {
    if (value.length > 0) {
        return null;
    } else {
        return error || "error";
    }
}

export function validateNotBlank(value: string, error?: string): string | null {
    return validateNotEmpty(value.trim(), error);
}
