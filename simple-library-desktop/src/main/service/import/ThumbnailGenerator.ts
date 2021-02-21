import { ImportData } from './importService';

const sharp = require('sharp');

export class ThumbnailGenerator {

    public appendBase64Thumbnail(importData: ImportData): Promise<ImportData> {
        return ThumbnailGenerator.createBase64Thumbnail(importData.filepath)
            .then(imgBase64 => {
                importData.thumbnail = imgBase64;
                return importData;
            });
    }

    private static createBase64Thumbnail(filepath: string): Promise<string> {
        return sharp(filepath)
            .resize({ width: 200, fit: sharp.fit.contain })
            .jpeg({ quality: 85 })
            .toBuffer()
            .then((data: Buffer) => data.toString("base64"))
            .then((imgBase64: string) => "data:image/jpg;base64," + imgBase64);
    }

}
