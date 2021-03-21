import { Collection, Group } from '../../../common/commonModels';
import * as React from 'react';
import { ReactElement } from 'react';
import { Item, ItemParams, Separator, Submenu } from 'react-contexify';


export function contextMenuCollectionTree(group: Group, rootLabel: string | null, onAction: (collection: Collection, data: ItemParams) => void): ReactElement {
    if (group && hasCollectionsInSubtree(group)) {
        return (
            <Submenu label={rootLabel ? rootLabel : group.name}>
                {[
                    ...group.collections.map((collection: Collection) => collectionItem(collection, onAction)),
                    (group.collections.length > 0 && group.children.length > 0 ? <Separator /> : null),
                    ...group.children.map((group: Group) => contextMenuCollectionTree(group, null, onAction)),
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}


export function contextMenuGroupTree(group: Group, rootLabel: string | null, includeNoneGroup: boolean, onAction: (group: Group, data: ItemParams) => void): ReactElement {
    if (group && group.children.length > 0) {
        return (
            <Submenu label={rootLabel ? rootLabel : group.name}>
                {[
                    (includeNoneGroup ? groupItem(noneGroup(), onAction) : null),
                    ...group.children.map((group: Group) => groupItem(group, onAction)),
                    (group.children.length > 0 && group.children.some(c => c.children.length > 0) ?
                        <Separator /> : null),
                    ...group.children.map((group: Group) => contextMenuGroupTree(group, null, false, onAction)),
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}

function collectionItem(collection: Collection, onAction: (collection: Collection, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(collection, data)} key={collection.id}>
            {collection.name}
        </Item>
    );
}

function groupItem(group: Group | null, onAction: (group: Group, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(group, data)} key={group.id}>
            {group.name}
        </Item>
    );
}

function hasCollectionsInSubtree(group: Group): boolean {
    if (group.collections.length > 0) {
        return true;
    } else {
        return group.children.some(hasCollectionsInSubtree);
    }
}

function noneGroup(): Group {
    return {
        id: undefined,
        name: "none",
        children: [],
        collections: [],
    };
}