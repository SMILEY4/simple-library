import DataAccess from './dataAccess';
import { sqlAllGroups, sqlInsertGroup } from './sql/sql';
import { GroupDTO } from '../../common/commonModels';

export class GroupDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    /**
     * @return a promise that resolves with all {@link GroupDTO}s
     */
    public getGroups(): Promise<GroupDTO[]> {
        return this.dataAccess.queryAll(sqlAllGroups())
            .then((rows: any[]) => rows.map((row: any) => {
                return {
                    id: row.group_id,
                    name: row.name,
                    parentId: row.parent_group_id,
                };
            }));
    }

    /**
     * Creates a new group with the given name
     * @param name the name of the new group
     * @return  a promise that resolves with the created {@link GroupDTO}
     */
    public createGroup(name: string): Promise<GroupDTO> {
        return this.dataAccess.executeRun(sqlInsertGroup(name))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    parentId: undefined,
                };
            });
    }

}
