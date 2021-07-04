import {MetadataEntryType} from "../../../common/commonModels";

export function concatAttributeColumnToEntries(str: string): MetadataEntry[] {
    if (str) {
        const regexGlobal: RegExp = /"(.+?)"="(.+?)"-"(.+?)"/g;
        const regex: RegExp = /"(.+?)"="(.+?)"-"(.+?)"/;
        return str.match(regexGlobal).map((strEntry: string) => {
            const strEntryParts: string[] = strEntry.match(regex);
            const entry: MetadataEntry = {
                key: strEntryParts[1],
                value: strEntryParts[2],
                type: strEntryParts[3] as MetadataEntryType,
            }
            return entry;
        })
    } else {
        return [];
    }
}

export interface MetadataEntry {
    key: string,
    value: string,
    type: MetadataEntryType,
}
