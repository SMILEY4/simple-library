import DataAccess from "../../dataAccess";

export abstract class CommandCustom<T> {

    public abstract run(dataAccess: DataAccess): Promise<T>;

}
