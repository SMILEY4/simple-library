export interface LibraryMetadata {
    name: string,
    timestampCreated: number,
    timestampLastOpened: number
}

export interface LastOpenedLibraryEntry {
    name: string,
    path: string
}