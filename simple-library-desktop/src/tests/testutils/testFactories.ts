import { ItemData } from '../../common/commonModels';

export function buildItemData(orgFilepath: string, targetFilepath: string): ItemData {
    return {
        sourceFilepath: orgFilepath,
        filepath: targetFilepath,
        hash: '',
        id: 0,
        thumbnail: '',
        timestamp: 0
    };
}