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
    sourceFilepath: string,
    hash: string,
    thumbnail: string,
}


export interface ImportProcessData {
    files: string[],
    fileTarget: ImportFileTarget,
    renameInstructions: BulkRenameInstruction,
}

export interface ImportFileTarget {
    action: FileTargetAction,
    targetDir: string
}

export enum FileTargetAction {
    KEEP = "keep",
    MOVE = "move",
    COPY = "copy"
}

export interface BulkRenameInstruction {
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