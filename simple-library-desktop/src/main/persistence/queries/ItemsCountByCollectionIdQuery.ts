import {sqlCountItemsWithCollectionId} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";
import DataAccess from "../dataAccess";


export class ItemsCountByCollectionIdQuery extends QuerySingle<number> {

    static run(dataAccess: DataAccess, collectionId: number): Promise<number> {
        return new ItemsCountByCollectionIdQuery(collectionId).run(dataAccess);
    }

    constructor(collectionId: number) {
        super(sqlCountItemsWithCollectionId(collectionId));
    }

    convertRow(row: any): number {
        return row.count;
    }

}
