import DataAccess from './dataAccess';
import { sqlAllGroups } from './sql';
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

}
