import {AttributeKey} from "../../worker/service/item/itemCommon";

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

export type AttributeValueDTO = null | string | number | boolean | Date | string[]

export interface AttributeDTO {
	key: AttributeKeyDTO,
	value: string,
	type: string,
	modified: boolean,
}

export interface AttributeKeyDTO {
	id: string,
	name: string,
	g0: string,
	g1: string,
	g2: string,
}

export function attributeKeysDtoEquals(a: AttributeKeyDTO, b: AttributeKeyDTO): boolean {
	return a.id === b.id && a.name === b.name && a.g0 === b.g0 && a.g1 === b.g1 && a.g2 === b.g2;
}

export function attributeKeyString(key: AttributeKeyDTO) {
	return key.id + "-" + key.name + "-" + key.g0 + "-" + key.g1 + "-" + key.g2;
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
