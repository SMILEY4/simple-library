import {CollectionType} from "../../../common/commonModels";
import {sqlFindCollectionById} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export interface ModelCollectionGetById {
    id: number,
    name: string,
    type: CollectionType
    smartQuery: string,
    groupId: number | null
}

export class CollectionGetByIdQuery extends QuerySingle<ModelCollectionGetById> {

    constructor(collectionId: number) {
        super(sqlFindCollectionById(collectionId));
    }

    convertRow(row: any): ModelCollectionGetById {
        return {
            id: row.collection_id,
            name: row.collection_name,
            type: row.collection_type,
            smartQuery: row.smart_query ? row.smart_query : "",
            groupId: row.group_id ? row.group_id : null,
        };
    }

}
