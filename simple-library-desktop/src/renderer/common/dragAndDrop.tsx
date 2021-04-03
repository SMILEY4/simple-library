/*
 * MIME-TYPES SEEM TO BE ALWAYS CONVERTED TO LOWERCASE
 * => ALL FIELDS/MODELS MUST BE LOWERCASE
 */

import { Collection, CollectionType, Group } from '../../common/commonModels';
import { collectAllDependants } from 'ts-loader/dist/utils';

export const META_MIME_TYPE_PREFIX = "custom/";

export module DragAndDropItems {

    export interface Metadata {
        copy: boolean,
        sourcecollection: number | undefined;
    }

    export interface Data {
        sourceCollectionId: number | undefined
        itemIds: number[]
    }

    export const META_MIME_TYPE = META_MIME_TYPE_PREFIX + "items";
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
        console.log("set drag label")
        DragAndDropUtils.setDragImageLabel(dataTransfer, "root", DOM_ELEMENT_LABEL_ID, text);
    }

    export function buildMimeTypeProvidedMetadata(copy: boolean, sourceCollection: number | undefined): string {
        const meta: Metadata = {
            copy: copy,
            sourcecollection: sourceCollection,
        };
        return META_MIME_TYPE + ";meta=" + JSON.stringify(meta);
    }

    export function setDropEffect(dataTransfer: DataTransfer, collectionOver: Collection | null): void {
        const meta: DragAndDropItems.Metadata | null = DragAndDropUtils.extractMimeTypeProvidedMetadata(dataTransfer, META_MIME_TYPE);
        let mode: string;
        if (!meta || !collectionOver || meta.sourcecollection === collectionOver.id || collectionOver.type === CollectionType.SMART) {
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


export module DragAndDropCollections {

    export interface Metadata {
        collectionid: number
    }

    export interface Data {
        collectionId: number
    }

    export const META_MIME_TYPE = META_MIME_TYPE_PREFIX + "collections";

    export function setDragData(dataTransfer: DataTransfer, collectionId: number): void {
        const data: Data = {
            collectionId: collectionId,
        };
        const strData: string = JSON.stringify(data);
        dataTransfer.setData("text/plain", strData);
        dataTransfer.setData("application/json", strData);
        dataTransfer.setData(DragAndDropCollections.buildMimeTypeProvidedMetadata(collectionId), strData);
        dataTransfer.effectAllowed = "move";
    }


    export function getDragData(dataTransfer: DataTransfer): Data {
        return JSON.parse(dataTransfer.getData("application/json"));
    }

    export function buildMimeTypeProvidedMetadata(collectionId: number): string {
        const meta: Metadata = {
            collectionid: collectionId,
        };
        return META_MIME_TYPE + ";meta=" + JSON.stringify(meta);
    }

    export function setDropEffect(dataTransfer: DataTransfer): void {
        const meta: DragAndDropItems.Metadata | null = DragAndDropUtils.extractMimeTypeProvidedMetadata(dataTransfer, META_MIME_TYPE);
        let mode: string;
        if (!meta) {
            mode = "none";
        } else {
            mode = "move";
        }
        dataTransfer.dropEffect = mode;
    }

}


export module DragAndDropGroups {

    export interface Metadata {
        groupid: number
    }

    export interface Data {
        groupId: number
    }

    export const META_MIME_TYPE = META_MIME_TYPE_PREFIX + "groups";

    export function setDragData(dataTransfer: DataTransfer, groupId: number): void {
        const data: Data = {
            groupId: groupId,
        };
        const strData: string = JSON.stringify(data);
        dataTransfer.setData("text/plain", strData);
        dataTransfer.setData("application/json", strData);
        dataTransfer.setData(DragAndDropGroups.buildMimeTypeProvidedMetadata(groupId), strData);
        dataTransfer.effectAllowed = "move";
    }


    export function getDragData(dataTransfer: DataTransfer): Data {
        return JSON.parse(dataTransfer.getData("application/json"));
    }

    export function buildMimeTypeProvidedMetadata(groupId: number): string {
        const meta: Metadata = {
            groupid: groupId,
        };
        return META_MIME_TYPE + ";meta=" + JSON.stringify(meta);
    }

    export function setDropEffect(dataTransfer: DataTransfer, targetGroupId: number, rootGroup: Group): void {
        const meta: DragAndDropGroups.Metadata | null = DragAndDropUtils.extractMimeTypeProvidedMetadata(dataTransfer, META_MIME_TYPE);
        let mode: string;
        if (!meta) {
            mode = "none";
        } else {
            if (allowDrop(meta.groupid, targetGroupId, rootGroup)) {
                mode = "move";
            } else {
                mode = "none";
            }

        }
        dataTransfer.dropEffect = mode;
    }

    export function allowDrop(draggedGroupId: number, targetGroupId: number, rootGroup: Group): boolean {
        if (draggedGroupId === targetGroupId) {
            return false;
        } else {
            return !subtreeContainsGroup(findSubtreeRoot(rootGroup, draggedGroupId), targetGroupId);
        }

    }

    function findSubtreeRoot(root: Group, groupId: number): Group | undefined {
        if (root.id === groupId) {
            return root;
        } else {
            return root.children
                .map((subtree: Group) => findSubtreeRoot(subtree, groupId))
                .find((group: Group) => group !== undefined);
        }
    }

    function subtreeContainsGroup(root: Group, groupId: number): boolean {
        if (root.id === groupId) {
            return true;
        } else {
            return root.children.some((subtree: Group) => subtreeContainsGroup(subtree, groupId));
        }
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

    export function getMetadataMimeType(dataTransfer: DataTransfer): string | undefined {
        const type: string | undefined = dataTransfer.types.find(type => type.startsWith(META_MIME_TYPE_PREFIX));
        if (type) {
            return type.substr(0, type.indexOf(";"));
        } else {
            return undefined;
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

}