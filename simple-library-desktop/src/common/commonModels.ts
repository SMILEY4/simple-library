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
    importTarget: ImportFileTarget,
    renameInstructions: BulkRenameInstruction,
}

export interface ImportFileTarget {
    action: ImportTargetAction,
    targetDir: string
}

export enum ImportTargetAction {
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

export const RENAME_PART_TYPES: RenamePartType[] = [
    RenamePartType.NOTHING,
    RenamePartType.TEXT,
    RenamePartType.NUMBER_FROM,
    RenamePartType.ORIGINAL_FILENAME,
];

export function renamePartTypeToDisplayString(type: RenamePartType): string {
    switch (type) {
        case RenamePartType.NOTHING:
            return "Nothing";
        case RenamePartType.TEXT:
            return "Text";
        case RenamePartType.NUMBER_FROM:
            return "Number From";
        case RenamePartType.ORIGINAL_FILENAME:
            return "Filename";
    }
}

export function displayStringToRenamePartType(str: string): RenamePartType {
    switch (str) {
        case "Nothing":
            return RenamePartType.NOTHING;
        case "Text":
            return RenamePartType.TEXT;
        case "Number From":
            return RenamePartType.NUMBER_FROM;
        case "Filename":
            return RenamePartType.ORIGINAL_FILENAME;
    }
}

export interface ImportResult {
    timestamp: number,
    amountFiles: number,
    failed: boolean,
    failureReason: string,
    encounteredErrors: boolean,
    filesWithErrors: ([string, string])[]
}

export interface ImportStatus {
    totalAmountFiles: number,
    completedFiles: number,
}

export const ALL_ITEMS_COLLECTION_ID: null = null;

export interface Collection {
    id: number | null,
    name: string,
    itemCount: number | undefined,
    groupId: number | undefined
}

export interface GroupDTO {
    id: number,
    name: string,
    parentId: number | undefined
}

export interface Group {
    id: number,
    name: string,
    children: Group[],
    collections: Collection[]
}

export function extractCollections(group: Group | undefined): Collection[] {
    const collections: Collection[] = [];
    if (group) {
        collections.push(...group.collections);
        group.children.forEach((child: Group) => {
            collections.push(...extractCollections(child));
        });
    }
    return collections;
}


export function extractGroups(group: Group | undefined): Group[] {
    const groups: Group[] = [];
    if (group) {
        groups.push(...group.children);
        group.children.forEach((child: Group) => {
            groups.push(...extractGroups(child));
        });
    }
    return groups;
}

export function groupTreeContainsCollection(root: Group, collectionId: number | null): boolean {
    const index: number = extractCollections(root)
        .map((collection: Collection) => collection.id)
        .indexOf(collectionId);
    return index !== -1;
}