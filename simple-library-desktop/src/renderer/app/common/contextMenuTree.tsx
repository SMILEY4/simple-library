import { Collection, Group } from '../../../common/commonModels';
import * as React from 'react';
import { ReactElement } from 'react';
import { Item, ItemParams, Separator, Submenu } from 'react-contexify';
import { BiImages, HiOutlineFolder } from 'react-icons/all';
import { BooleanPredicate } from 'react-contexify/src/types/index';


export function contextMenuTree(group: Group,
                                rootLabel: string | null,
                                onAction: (collection: Collection, data: ItemParams) => void,
                                collectionFilter: (collection: Collection) => boolean): ReactElement {
    if (group && hasCollectionsInSubtree(group)) {
        return (
            <Submenu label={
                rootLabel
                    ? rootLabel
                    : [<HiOutlineFolder style={{ paddingRight: "var(--s-0-25)" }} />, group.name]
            }>
                {[
                    ...group.collections.filter(collectionFilter).map((collection: Collection) => collectionItem(collection, onAction)),
                    treeSeparator(group, collectionFilter),
                    ...group.children.map((group: Group) => contextMenuTree(group, null, onAction, collectionFilter)),
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}

export function contextMenuGroupTree(group: Group,
                                     rootLabel: string | null,
                                     includeNoneGroup: boolean,
                                     onAction: (group: Group, data: ItemParams) => void,
                                     disabled?: BooleanPredicate): ReactElement {
    if (group && group.children.length > 0) {
        return (
            <Submenu
                label={
                    rootLabel
                        ? rootLabel
                        : [<HiOutlineFolder style={{ paddingRight: "var(--s-0-25)" }} />, group.name]
                }
                disabled={disabled}
            >
                {[
                    (includeNoneGroup ? groupItem(noneGroup(), onAction) : null),
                    ...group.children.map((group: Group) => groupItem(group, onAction)),
                    groupTreeSeparator(group),
                    ...group.children.map((group: Group) => contextMenuGroupTree(group, null, false, onAction)),
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}

function treeSeparator(group: Group, collectionFilter: ((collection: Collection) => boolean) | undefined) {
    return group.collections.filter((c:Collection) => collectionFilter ? collectionFilter(c) : true).length > 0 && group.children.length > 0
        ? <Separator />
        : null;
}

function groupTreeSeparator(group: Group) {
    return group.children.length > 0 && group.children.some(c => c.children.length > 0)
        ? <Separator />
        : null;
}

function collectionItem(collection: Collection, onAction: (collection: Collection, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(collection, data)} key={collection.id}>
            <BiImages style={{ paddingRight: "var(--s-0-25)" }} />
            {collection.name}
        </Item>
    );
}

function groupItem(group: Group | null, onAction: (group: Group, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(group, data)} key={group.id}>
            <HiOutlineFolder style={{ paddingRight: "var(--s-0-25)" }} />
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
        id: null,
        name: "none",
        children: [],
        collections: [],
    };
}