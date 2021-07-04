import DataAccess from "../../dataAccess";

export abstract class Command {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<number> {
        return dataAccess.executeRun(this.sqlString)
    }

}
