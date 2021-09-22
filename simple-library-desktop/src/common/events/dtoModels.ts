export interface ExiftoolInfoDTO {
	location: string | null;
	defined: boolean;
}


export interface LastOpenedLibraryDTO {
	name: string,
	path: string
}


export interface LibraryInfoDTO {
	name: string,
	timestampCreated: number,
	timestampLastOpened: number
}


export type ThemeDTO = "dark" | "light";


export type CollectionTypeDTO = "normal" | "smart";


export interface CollectionDTO {
	id: number,
	name: string,
	type: CollectionTypeDTO
	smartQuery: string | null,
	itemCount: number | null,
	groupId: number | null
}


export interface GroupDTO {
	id: number,
	name: string,
	parentGroupId: number | null,
	collections: CollectionDTO[]
	children: GroupDTO[],
}


export interface ItemDTO {
	id: number,
	timestamp: number,
	filepath: string,
	sourceFilepath: string,
	hash: string,
	thumbnail: string,
	attributes?: AttributeDTO[]
}


export type AttributeTypeDTO = "none" | "text" | "number" | "boolean" | "date" | "list"

export type AttributeValueDTO = null | string | number | boolean | Date

export interface AttributeDTO {
	key: string,
	value: AttributeValueDTO,
	type: AttributeTypeDTO,
}


export interface ImportStatusDTO {
	totalAmountFiles: number,
	completedFiles: number,
}


export interface ImportResultDTO {
	timestamp: number,
	amountFiles: number,
	failed: boolean,
	failureReason: string,
	encounteredErrors: boolean,
	filesWithErrors: ([string, string])[]
}


export interface ImportProcessDataDTO {
	files: string[],
	importTarget: ImportFileTargetDTO,
	renameInstructions: BulkRenameInstructionDTO,
}


export interface ImportFileTargetDTO {
	action: ImportTargetActionDTO,
	targetDir: string
}


export type ImportTargetActionDTO = "keep" | "move" | "copy"


export interface BulkRenameInstructionDTO {
	doRename: boolean,
	parts: RenamePartDTO[]
}


export interface RenamePartDTO {
	type: RenamePartTypeDTO,
	value: string
}


export type RenamePartTypeDTO = "nothing" | "text" | "number_from" | "original_filename";

export function renamePartTypeAllowsUserInput(type: RenamePartTypeDTO): boolean {
	switch (type) {
		case "nothing":
			return false;
		case "text":
			return true;
		case "number_from":
			return true;
		case "original_filename":
			return false;
	}
}
