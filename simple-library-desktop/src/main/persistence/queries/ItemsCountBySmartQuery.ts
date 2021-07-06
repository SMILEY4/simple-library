import {sqlCountItemsWithCustomFilter, sqlGetItemsCountTotal} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";
import DataAccess from "../dataAccess";


export class ItemsCountBySmartQuery extends QuerySingle<number> {

    static run(dataAccess: DataAccess, smartQuery: string | null): Promise<number> {
        return new ItemsCountBySmartQuery(smartQuery).run(dataAccess);
    }

    constructor(smartQuery: string | null) {
        super(smartQuery && smartQuery.trim().length > 0
            ? sqlCountItemsWithCustomFilter(smartQuery.trim())
            : sqlGetItemsCountTotal());
    }

    convertRow(row: any): number {
        return row.count;
    }

}
