import DataAccess from "../../dataAccess";

export abstract class QueryMultiple<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T[]> {
        return dataAccess.queryAll(this.sqlString)
            .then((rows: any[]) => rows.map(this.convertRow))
            .then((result: T[]) => {
                console.debug("Query Multiple:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with result", result)
                return result;
            })
            .catch((err: any) => {
                console.debug("Query Multiple:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with error", err);
                throw err;
            })
    }

    abstract convertRow(row: any): T;

}
