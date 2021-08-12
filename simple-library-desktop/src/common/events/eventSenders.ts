import {EventSender} from "./core/eventSender";
import {IpcWrapper} from "../messaging/core/ipcWrapper";
import {ItemsImportStatusChannel} from "../messaging/channels/channels";
import {ImportStatusDTO} from "../messaging/dtoModels";

export const IMPORT_STATUS_ID = ItemsImportStatusChannel.ID;

export class ImportStatusEventSender extends EventSender<ImportStatusDTO, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(IMPORT_STATUS_ID, ipcWrapper, {idPrefix: idPrefix});
    }
}
