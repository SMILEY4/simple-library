import {META_MIME_TYPE_PREFIX} from "../../app/common/dragAndDrop";

export type DragOpType = "none" | "copy" | "copyLink" | "copyMove" | "link" | "linkMove" | "move" | "all"


export interface DragDataContainer {
	metaId: string,
	metaData?: any,
	data?: any,
	allowedOps: DragOpType
}


export function setDragData(metaId: string, metaData: any, data: any, dataTransfer: DataTransfer) {
	const strData: string = JSON.stringify(data);
	const strMeta: string = JSON.stringify(metaData);
	dataTransfer.setData("text/plain", strData);
	dataTransfer.setData("application/json", strData);
	dataTransfer.setData("custom/" + metaId + ";meta=" + strMeta, strData);
}

export function setDragImageLabel(dataTransfer: DataTransfer, parentElementId: string, elementId: string, text: string): Element {
	let dragElement: any = document.getElementById(elementId);
	if (!dragElement) {
		dragElement = document.createElement("div");
		dragElement.id = elementId;
		document.getElementById(parentElementId).appendChild(dragElement);
	}
	dragElement.className = "drag-label";
	dragElement.innerText = text;
	dataTransfer.setDragImage(dragElement, -10, -10);
	return dragElement;
}

export function getMetadataMimeType(dataTransfer: DataTransfer): string | null {
	const type: string | undefined = dataTransfer.types.find(type => type.startsWith(META_MIME_TYPE_PREFIX));
	if (type) {
		return type.substr(0, type.indexOf(";"));
	} else {
		return null;
	}
}

export function extractMimeTypeProvidedMetadata<T>(dataTransfer: DataTransfer, metaMimeType: string): T | null {
	const type: string | undefined = dataTransfer.types.find(type => type.startsWith(metaMimeType));
	if (type) {
		const strMeta: string = type.substring(type.indexOf("=") + 1, type.length);
		return JSON.parse(strMeta);
	} else {
		return null;
	}
}

export function setDropEffectForbidden(dataTransfer: DataTransfer): void {
	dataTransfer.dropEffect = "none";
}