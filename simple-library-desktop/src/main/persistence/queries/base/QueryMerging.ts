import DataAccess from "../../dataAccess";

export abstract class QueryMerging<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T> {
        return dataAccess.queryAll(this.sqlString)
            .then((rows: any[]) => this.mergeRows(rows))
    }

    abstract mergeRows(rows: any[]): T;

}
