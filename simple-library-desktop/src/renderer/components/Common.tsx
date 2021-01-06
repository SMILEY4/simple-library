export enum HighlightType {
    NONE = "none",
    INFO = "info",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}


export enum StyleType {
    FILLED = "filled",
    GHOST = "ghost",
    TEXT = "text",
}

/**
 * @param className the classname or undefined
 * @returns the given className with an empty space before it (e.g. "my-class" -> " my-class") or an empty string.
 */
export function classNameOrEmpty(className?: string): string {
    return (className ? " " + className : "")
}

/**
 * @param value the value, null or undefined
 * @param defaultValue the value to return when the given value is null/undefined
 * @returns the value as a string or an empty string in case of null/undefined
 */
export function toStringOrDefault(value: any, defaultValue: string): string {
    return value === undefined || value === null ? defaultValue : value
}