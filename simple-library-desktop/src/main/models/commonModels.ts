export interface LibraryMetadata {
    name: string,
    timestampCreated: number,
    timestampLastOpened: number
}

export interface LastOpenedLibraryEntry {
    name: string,
    path: string
}

export interface ItemData {
    id: number,
    timestamp: number,
    filepath: string,
    hash: string,
    thumbnail: string,
}

export enum FileAction {
    KEEP = "keep",
    MOVE = "move",
    COPY = "copy"
}