import DataAccess from "../../dataAccess";

export abstract class CommandMultiple {

    sqlStrings: string[];

    protected constructor(sqlStrings: string[]) {
        this.sqlStrings = sqlStrings;
    }

    public async run(dataAccess: DataAccess): Promise<void> {
        for (let sqlString of this.sqlStrings) {
            await dataAccess.executeRun(sqlString);
        }
    }

}
