export enum AlignmentMain {
    START = "start",
    END = "end",
    CENTER = "center",
    SPACE_BETWEEN = "space-between",
    SPACED = "spaced"
}

export enum AlignmentCross {
    START = "start",
    END = "end",
    CENTER = "center",
    STRETCH = "stretch",
}

export enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

export enum HighlightType {
    NONE = "none",
    DEFAULT = "default",
    INFO = "info",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}


export enum StyleType {
    FILLED = "filled",
    GHOST = "ghost",
    GHOST_BG0 = "ghost-bg0",
    GHOST_BG1 = "ghost-bg1",
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

/**
 * Returns either the given value or the default value
 * @param value the value to check
 * @param defaultValue the default value to return if the value is null/undefined
 * @return the given value or the given default value to return if the value is null/undefined
 */
export function orDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value
        ? value
        : defaultValue
}

/**
 * Calls the given function if it is not null or undefined
 * @param func the function to call
 */
export function callSafe(func: any) {
    if (func) {
        func()
    }
}