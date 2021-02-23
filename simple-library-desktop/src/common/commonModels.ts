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
    orgFilepath: string,
    filepath: string,
    hash: string,
    thumbnail: string,
}


export interface ImportProcessData {
    files: string[],
    fileHandleData: ImportFileHandleData,
    renameData: BulkRenameData,
}

export interface ImportFileHandleData {
    action: FileAction,
    targetDir: string
}

export enum FileAction {
    KEEP = "keep",
    MOVE = "move",
    COPY = "copy"
}

export interface BulkRenameData {
    doRename: boolean,
    parts: RenamePart[]
}

export interface RenamePart {
    type: RenamePartType,
    value: string
}

export enum RenamePartType {
    NOTHING = "nothing",
    TEXT = "text",
    NUMBER_FROM = "number_from",
    ORIGINAL_FILENAME = "original_filename"
}