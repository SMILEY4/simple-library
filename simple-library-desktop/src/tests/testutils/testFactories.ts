import { ItemData } from '../../main/models/commonModels';

export function buildItemData(orgFilepath: string, targetFilepath: string): ItemData {
    return {
        orgFilepath: orgFilepath,
        filepath: targetFilepath,
        hash: '',
        id: 0,
        thumbnail: '',
        timestamp: 0,
    };
}