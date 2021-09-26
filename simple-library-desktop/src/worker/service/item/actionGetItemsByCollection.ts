import {ActionGetCollectionById} from "../collection/actionGetCollectionById";
import {Attribute, Item, rowsToItems} from "./itemCommon";
import {Collection} from "../collection/collectionCommons";
import {DataRepository} from "../dataRepository";

/**
 * Get all items of the given collection (with the attributes of the given keys)
 */
export class ActionGetItemsByCollection {

    private readonly repository: DataRepository;
    private readonly actionGetCollectionById: ActionGetCollectionById;


    constructor(repository: DataRepository, actionGetCollectionById: ActionGetCollectionById) {
        this.repository = repository;
        this.actionGetCollectionById = actionGetCollectionById;
    }


    public perform(collectionId: number, attributeKeys: string[], includeMissingAttributes: boolean): Promise<Item[]> {
        return this.findCollection(collectionId)
            .then(collection => this.getItemData(collection, attributeKeys))
            .then(rowsToItems)
            .then(items => includeMissingAttributes ? this.appendMissingAttributes(items, attributeKeys) : items)
    }


    private findCollection(collectionId: number): Promise<Collection> {
        return this.actionGetCollectionById.perform(collectionId)
            .then((collection: Collection | null) => !collection
                ? Promise.reject("Cant fetch items: collection with id " + collectionId + " not found")
                : collection
            );
    }


    private getItemData(collection: Collection, attributeKeys: string[]): Promise<any[]> {
        switch (collection.type) {
            case "normal":
                return this.getItemDataFromNormal(collection, attributeKeys);
            case "smart":
                return this.getItemDataFromSmart(collection, attributeKeys);
            default: {
                throw "Unexpected collection type: " + collection.type;
            }
        }
    }


    private getItemDataFromNormal(collection: Collection, attributeKeys: string[]): Promise<any[]> {
        return this.repository.getItemsByCollection(collection.id, attributeKeys);
    }


    private getItemDataFromSmart(collection: Collection, attributeKeys: string[]): Promise<any[]> {
        const fetchWithQuery = collection.smartQuery && collection.smartQuery.length > 0;
        return fetchWithQuery
            ? this.repository.getItemsByCustomQuery(collection.smartQuery, attributeKeys)
            : this.repository.getItemsAll(attributeKeys);
    }


    private appendMissingAttributes(items: Item[], attributeKeys: string[]): Item[] {
        return items.map(item => this.appendMissingAttributesToItem(item, attributeKeys));
    }


    private appendMissingAttributesToItem(item: Item, attributeKeys: string[]): Item {
        const itemKeys: string[] = item.attributes.map(att => att.key);
        const missingAttributes: Attribute[] = attributeKeys
            .filter(key => !itemKeys.find(k => k === key))
            .map(key => this.buildMissingAttribute(key))
        item.attributes.push(...missingAttributes);
        return item;
    }


    private buildMissingAttribute(key: string): Attribute {
        return {
            key: key,
            value: null,
            type: "none",
            modified: false
        };
    }

}
