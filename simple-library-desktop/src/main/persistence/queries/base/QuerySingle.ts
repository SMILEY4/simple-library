import DataAccess from "../../dataAccess";

export abstract class QuerySingle<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T | null> {
        return dataAccess.querySingle(this.sqlString)
            .then((row: any) => row ? this.convertRow(row) : null)
    }

    abstract convertRow(row: any): T;

}
