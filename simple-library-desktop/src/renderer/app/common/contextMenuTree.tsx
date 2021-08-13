import * as React from "react";
import {ReactElement} from "react";
import {Item, ItemParams, Separator, Submenu} from "react-contexify";
import {BiImages, HiOutlineFolder} from "react-icons/all";
import {BooleanPredicate} from "react-contexify/src/types/index";
import {CollectionDTO, GroupDTO} from "../../../common/events/dtoModels";


export function contextMenuTree(group: GroupDTO,
                                rootLabel: string | null,
                                onAction: (collection: CollectionDTO, data: ItemParams) => void,
                                collectionFilter: (collection: CollectionDTO) => boolean): ReactElement {
    if (group && hasCollectionsInSubtree(group)) {
        return (
            <Submenu label={
                rootLabel
                    ? rootLabel
                    : [<HiOutlineFolder style={{paddingRight: "var(--s-0-25)"}}/>, group.name]
            }>
                {[
                    ...group.collections.filter(collectionFilter).map((collection: CollectionDTO) => collectionItem(collection, onAction)),
                    treeSeparator(group, collectionFilter),
                    ...group.children.map((group: GroupDTO) => contextMenuTree(group, null, onAction, collectionFilter))
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}

export function contextMenuGroupTree(group: GroupDTO,
                                     rootLabel: string | null,
                                     includeNoneGroup: boolean,
                                     onAction: (group: GroupDTO, data: ItemParams) => void,
                                     disabled?: BooleanPredicate): ReactElement {
    if (group && group.children.length > 0) {
        return (
            <Submenu
                label={
                    rootLabel
                        ? rootLabel
                        : [<HiOutlineFolder style={{paddingRight: "var(--s-0-25)"}}/>, group.name]
                }
                disabled={disabled}
            >
                {[
                    (includeNoneGroup ? groupItem(noneGroup(), onAction) : null),
                    ...group.children.map((group: GroupDTO) => groupItem(group, onAction)),
                    groupTreeSeparator(group),
                    ...group.children.map((group: GroupDTO) => contextMenuGroupTree(group, null, false, onAction))
                ]}
            </Submenu>
        );
    } else {
        return null;
    }
}

function treeSeparator(group: GroupDTO, collectionFilter: ((collection: CollectionDTO) => boolean) | undefined) {
    return group.collections.filter((c: CollectionDTO) => collectionFilter ? collectionFilter(c) : true).length > 0 && group.children.length > 0
        ? <Separator/>
        : null;
}

function groupTreeSeparator(group: GroupDTO) {
    return group.children.length > 0 && group.children.some(c => c.children.length > 0)
        ? <Separator/>
        : null;
}

function collectionItem(collection: CollectionDTO, onAction: (collection: CollectionDTO, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(collection, data)} key={collection.id}>
            <BiImages style={{paddingRight: "var(--s-0-25)"}}/>
            {collection.name}
        </Item>
    );
}

function groupItem(group: GroupDTO | null, onAction: (group: GroupDTO, data: ItemParams) => void): ReactElement {
    return (
        <Item onClick={(data: ItemParams) => onAction(group, data)} key={group.id}>
            <HiOutlineFolder style={{paddingRight: "var(--s-0-25)"}}/>
            {group.name}
        </Item>
    );
}

function hasCollectionsInSubtree(group: GroupDTO): boolean {
    if (group.collections.length > 0) {
        return true;
    } else {
        return group.children.some(hasCollectionsInSubtree);
    }
}

function noneGroup(): GroupDTO {
    return {
        id: null,
        name: "none",
        parentGroupId: null,
        collections: [],
        children: [],
    };
}
