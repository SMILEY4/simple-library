import { ItemData } from '../../../../common/commonModels';

const sharp = require('sharp');

export class ImportStepThumbnail {

    private static THUMBNAIL_WIDTH: number = 200;
    private static JPEG_QUALITY: number = 85;

    public handle(itemData: ItemData): Promise<ItemData> {
        return ImportStepThumbnail.createBase64Thumbnail(itemData.filepath)
            .then(imgBase64 => {
                itemData.thumbnail = imgBase64;
                return itemData;
            });
    }

    private static createBase64Thumbnail(filepath: string): Promise<string> {
        return sharp(filepath)
            .resize({ width: this.THUMBNAIL_WIDTH, fit: sharp.fit.contain })
            .jpeg({ quality: this.JPEG_QUALITY })
            .toBuffer()
            .then((data: Buffer) => data.toString("base64"))
            .then((imgBase64: string) => {
                if (!imgBase64 || imgBase64.length === 0) {
                    throw "Could not create thumbnail";
                } else {
                    return imgBase64;
                }
            })
            .then((imgBase64: string) => "data:image/jpg;base64," + imgBase64);
    }

}
