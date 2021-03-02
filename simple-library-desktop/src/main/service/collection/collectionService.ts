import { CollectionDataAccess } from '../../persistence/collectionDataAccess';
import { Collection } from '../../../common/commonModels';

export class CollectionService {

    collectionDataAccess: CollectionDataAccess;


    constructor(collectionDataAccess: CollectionDataAccess) {
        this.collectionDataAccess = collectionDataAccess;
    }

    public getAllCollections(): Promise<Collection[]> {
        return this.collectionDataAccess.getCollections();
    }

}