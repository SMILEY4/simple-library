import DataAccess from "../../dataAccess";

export abstract class Command {

    sqlString: string | null;

    protected constructor(sqlString: string | null) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<number | null> {
        if (this.sqlString) {
            return dataAccess.executeRun(this.sqlString)
        } else {
            return Promise.resolve(null);
        }
    }

}
