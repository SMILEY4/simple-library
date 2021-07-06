import DataAccess from "../../dataAccess";

export abstract class QuerySingle<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T | null> {
        return dataAccess.querySingle(this.sqlString)
            .then((row: any) => row ? this.convertRow(row) : null)
            .then((result: T) => {
                console.debug("Query Single:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with result", result)
                return result;
            })
            .catch((err: any) => {
                console.debug("Query Single:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with error", err);
                throw err;
            })
    }

    abstract convertRow(row: any): T;

}
