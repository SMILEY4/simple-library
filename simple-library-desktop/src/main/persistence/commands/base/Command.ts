import DataAccess from "../../dataAccess";

export abstract class Command {

    sqlString: string;

    protected constructor(sqlString: string) {
        this.sqlString = sqlString;
    }

    public run(dataAccess: DataAccess): Promise<number> {
        return dataAccess.executeRun(this.sqlString)
            .then((result: number) => {
                console.debug("Command:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with result", result)
                return result;
            })
            .catch((err: any) => {
                console.debug("Command:", this.sqlString.replace(/(\r\n|\n|\r)/gm, " "), "with error", err);
                throw err;
            })
    }

}
