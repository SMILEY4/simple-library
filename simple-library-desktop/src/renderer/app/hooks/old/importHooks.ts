import { useState } from 'react';
import { useGroups } from './groupHooks';
import { useItems } from './itemHooks';
import {
    ImportProcessData,
    ImportResult,
    ImportStatus,
    ImportTargetAction,
    RenamePart,
    RenamePartType,
} from '../../../../common/commonModels';
import { genNotificationId } from '../../common/utils/notificationUtils';
import { AppNotificationType } from '../../store/state';
import { onImportStatusCommands, requestImport } from '../../common/messaging/messagingInterface';
import { useNotificationsOld, useStateRef } from './miscAppHooks';

export function useImport() {

    const [showDialog, setShowDialog] = useState(false);
    const { addNotification, updateNotification, removeNotification } = useNotificationsOld();
    const { reloadRootGroup } = useGroups();
    const { reloadItems } = useItems();

    const startImportProcess = (data: ImportProcessData) => {
        setShowDialog(false);

        const importStatusNotificationId = genNotificationId();
        addNotification(importStatusNotificationId, AppNotificationType.IMPORT_STATUS, null);
        onImportStatusCommands((status: ImportStatus) => updateNotification(importStatusNotificationId, status));

        requestImport(data,
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_SUCCESSFUL, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED, result),
            (result: ImportResult) => addNotification(genNotificationId(), AppNotificationType.IMPORT_WITH_ERRORS, result),
        )
            .catch(error => addNotification(genNotificationId(), AppNotificationType.IMPORT_FAILED_UNKNOWN, error))
            .then(() => reloadRootGroup())
            .then(() => reloadItems())
            .finally(() => removeNotification(importStatusNotificationId));
    };

    return {
        showImportDialog: showDialog,
        openImportDialog: () => setShowDialog(true),
        closeImportDialog: () => setShowDialog(false),
        startImportProcess: startImportProcess,
    };

}

export function useFilesToImport() {

    const [files, setFiles, refFiles] = useStateRef<string[]>([]);
    const [valid, setValid] = useState(true);

    const selectFiles = (files: string[]) => {
        setFiles(files);
        setValid(files.length > 0);
    };

    return {
        filesToImport: files,
        getRefFilesToImport: () => refFiles.current,
        selectFilesToImport: selectFiles,
        filesToImportValid: valid,
    };
}


export function useImportTarget() {

    const [type, setType, refType] = useStateRef(ImportTargetAction.KEEP);
    const [target, setTarget, refTarget] = useStateRef("");
    const [targetValid, setTargetValid] = useState(true);

    const selectTarget = (target: string) => {
        setTarget(target);
        setTargetValid(target.trim().length > 0);
    };

    const selectType = (type: ImportTargetAction) => {
        setType(type);
        if (type === ImportTargetAction.COPY || type === ImportTargetAction.MOVE) {
            if (target.trim().length === 0) {
                setTargetValid(false);
            }
        }
    };

    return {

        targetDir: target,
        getRefTargetDir: () => refTarget.current,
        selectTargetDir: selectTarget,
        targetDirValid: targetValid,

        targetType: type,
        getRefTargetType: () => refType.current,
        selectTargetType: selectType,
    };
}


export function useRenameImportFiles() {

    const [enabled, setEnabled, refEnabled] = useStateRef(false);
    const [parts, setParts, refParts] = useStateRef<RenamePart[]>([]);
    const [renameValid, setRenameValid] = useState(true);
    const [invalidParts, setInvalidParts] = useState<number[]>([]);


    const setPartType = (index: number, type: RenamePartType) => {
        setParts(parts.map((part, index) => {
            if (index === index) {
                return {
                    type: type,
                    value: part.value,
                };
            } else {
                return part;
            }
        }));
        // todo: validation
    };

    const setPartValue = (index: number, value: string) => {
        setParts(parts.map((part, index) => {
            if (index === index) {
                return {
                    type: part.type,
                    value: value,
                };
            } else {
                return part;
            }
        }));
        // todo: validation
    };

    return {
        renameEnabled: enabled,
        getRefRenameEnabled: () => refEnabled.current,
        setRenameEnabled: setEnabled,

        renameParts: parts,
        getRefRenameParts: () => refParts.current,
        setPartType: setPartType,
        setPartValue: setPartValue,

        renameValid: renameValid,
        invalidRenameParts: invalidParts,

    };
}