import DataAccess from "../../dataAccess";

export abstract class QueryMerging<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T> {
        return dataAccess.queryAll(this.sqlString)
            .then((rows: any[]) => this.mergeRows(rows))
            .then((result: T) => {
                console.debug("Query Merging:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with result", result)
                return result;
            })
            .catch((err: any) => {
                console.debug("Query Merging:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with error", err);
                throw err;
            })
    }

    abstract mergeRows(rows: any[]): T;

}
