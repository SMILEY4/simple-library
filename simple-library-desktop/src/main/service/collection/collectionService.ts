import { CollectionDataAccess } from '../../persistence/collectionDataAccess';
import { Collection } from '../../../common/commonModels';

export class CollectionService {

    collectionDataAccess: CollectionDataAccess;


    constructor(collectionDataAccess: CollectionDataAccess) {
        this.collectionDataAccess = collectionDataAccess;
    }

    public getAllCollections(includeItemCount: boolean): Promise<Collection[]> {
        return this.collectionDataAccess.getCollections(includeItemCount);
    }

}