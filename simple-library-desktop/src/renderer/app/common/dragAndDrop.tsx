/*
 * MIME-TYPES SEEM TO BE ALWAYS CONVERTED TO LOWERCASE
 * -> ALL FIELDS/MODELS MUST BE LOWERCASE
 */

export module DragAndDropItems {

    export interface Metadata {
        copy: boolean,
        sourcecollection: number | undefined;
    }

    export interface Data {
        sourceCollectionId: number | undefined
        itemIds: number[]
    }

    const META_MIME_TYPE = "custom/items";
    const DOM_ELEMENT_LABEL_ID = "drag-ghost-image";

    export function setDragData(dataTransfer: DataTransfer, sourceCollection: number | undefined, itemIds: number[], copy: boolean): void {
        const data: Data = {
            itemIds: itemIds,
            sourceCollectionId: sourceCollection,
        };
        const strData: string = JSON.stringify(data);
        dataTransfer.setData("text/plain", strData);
        dataTransfer.setData("application/json", strData);
        dataTransfer.setData(DragAndDropItems.buildMimeTypeProvidedMetadata(copy, sourceCollection), strData);
        dataTransfer.effectAllowed = "copyMove";
    }


    export function getDragData(dataTransfer: DataTransfer): Data {
        return JSON.parse(dataTransfer.getData("application/json"));
    }

    export function setDragLabel(dataTransfer: DataTransfer, copy: boolean, nItems: number): void {
        let text: string;
        if (copy) {
            text = "Copy " + nItems + (nItems === 1 ? " item" : " items");
        } else {
            text = "Move " + nItems + (nItems === 1 ? " item" : " items");
        }
        DragAndDropUtils.setDragImageLabel(dataTransfer, "root", DOM_ELEMENT_LABEL_ID, text);
    }

    export function buildMimeTypeProvidedMetadata(copy: boolean, sourceCollection: number | undefined): string {
        const meta: Metadata = {
            copy: copy,
            sourcecollection: sourceCollection,
        };
        return META_MIME_TYPE + ";meta=" + JSON.stringify(meta);
    }

    export function setDropEffect(dataTransfer: DataTransfer, collectionIdOver: number | undefined): void {
        const meta: DragAndDropItems.Metadata | null = DragAndDropUtils.extractMimeTypeProvidedMetadata(dataTransfer, META_MIME_TYPE);
        let mode: string;
        if (!meta || !collectionIdOver || meta.sourcecollection === collectionIdOver) {
            mode = "none";
        } else {
            if (meta.copy) {
                mode = "copy";
            } else {
                mode = "move";
            }
        }
        dataTransfer.dropEffect = mode;
    }

}


export module DragAndDropUtils {

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

    export function extractMimeTypeProvidedMetadata<T>(dataTransfer: DataTransfer, metaMimeType: string): T | null {
        const type: string | undefined = dataTransfer.types.find(type => type.startsWith(metaMimeType));
        if (type) {
            const strMeta: string = type.substring(type.indexOf("=") + 1, type.length);
            return JSON.parse(strMeta);
        } else {
            return null;
        }
    }

}