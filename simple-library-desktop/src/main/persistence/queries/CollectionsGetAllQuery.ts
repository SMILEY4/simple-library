import {QueryMultiple} from "./base/QueryMultiple";
import {CollectionType} from "../../../common/commonModels";
import {sqlAllCollections} from "../sql/sql";
import DataAccess from "../dataAccess";
import {ItemsCountBySmartQuery} from "./ItemsCountBySmartQuery";


export interface ModelCollectionsGetAll {
    id: number,
    name: string,
    type: CollectionType
    smartQuery: string,
    itemCount: number,
    groupId: number | null
}

export class CollectionsGetAllQuery extends QueryMultiple<ModelCollectionsGetAll> {

    includeItemCount: boolean

    constructor(includeItemCount: boolean) {
        super(sqlAllCollections(includeItemCount));
        this.includeItemCount = includeItemCount;
    }


    run(dataAccess: DataAccess): Promise<ModelCollectionsGetAll[]> {
        const result = super.run(dataAccess);
        if (this.includeItemCount) {
            return result.then(entries => this.enrichWithItemCount(entries, dataAccess));
        } else {
            return result;
        }
    }

    private enrichWithItemCount(entries: ModelCollectionsGetAll[], dataAccess: DataAccess): Promise<ModelCollectionsGetAll[]> {
        const promises: Promise<ModelCollectionsGetAll>[] = entries
            .map(entry => {
                    if (entry.type === CollectionType.SMART) {
                        return new ItemsCountBySmartQuery(entry.smartQuery)
                            .run(dataAccess)
                            .then(count => entry.itemCount = count)
                            .then(() => entry)
                    } else {
                        return Promise.resolve(entry);
                    }
                }
            )
        return Promise.all(promises);
    }

    convertRow(row: any): ModelCollectionsGetAll {
        return {
            id: row.collection_id,
            name: row.collection_name,
            type: row.collection_type,
            smartQuery: row.smart_query ? row.smart_query : "",
            itemCount: row.item_count ? row.item_count : 0,
            groupId: row.group_id ? row.group_id : null,
        };
    }

}
