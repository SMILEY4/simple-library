import DataAccess from "../../dataAccess";

export abstract class CommandMultiple {

    sqlStrings: string[];

    protected constructor(sqlStrings: string[]) {
        this.sqlStrings = sqlStrings;
    }

    public async run(dataAccess: DataAccess): Promise<void> {
        const promises: Promise<any>[] = this.sqlStrings.map(sql => dataAccess.executeRun(sql))
        return Promise.all(promises)
            .then(() => console.debug("Command Multiple:", this.sqlStrings))
            .catch((err: any) => {
                console.debug("Command Multiple:", this.sqlStrings, "with error", err);
                throw err;
            })
    }

}
