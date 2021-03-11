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

    public createCollection(name: string): Promise<Collection> {
        return this.collectionDataAccess.createCollection(name);
    }

    public deleteCollection(collectionId: number): Promise<void> {
        return this.collectionDataAccess.deleteCollection(collectionId);
    }

    public renameCollection(collectionId: number, newCollectionName: string): Promise<void> {
        return this.collectionDataAccess.renameCollection(collectionId, newCollectionName);
    }

}