import DataAccess from "../../dataAccess";

export abstract class QueryMultiple<T> {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<T[]> {
        return dataAccess.queryAll(this.sqlString)
            .then((rows: any[]) => rows.map(this.convertRow))
    }

    abstract convertRow(row: any): T;

}
