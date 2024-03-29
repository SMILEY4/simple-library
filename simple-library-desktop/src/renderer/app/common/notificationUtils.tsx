import React, {ReactElement} from "react";
import {NotificationStackEntry} from "../../components/modals/notification/NotificationStack";
import {AppNotification, AppNotificationType} from "../hooks/store/notificationState";


export function genNotificationId(): string {
    return "" + (Date.now() + Math.random());
}

export function toNotificationEntry(notificationData: AppNotification, onClose: () => void): NotificationStackEntry {

    switch (notificationData.type) {
        case AppNotificationType.GENERIC: {
            return {
                id: notificationData.id,
                type: "error",
                title: "An unexpected error occurred",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.CREATE_LIBRARY: {
            return {
                id: notificationData.id,
                type: "info",
                title: "Creating Library",
                content: "This can take a few seconds.",
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.OPEN_LIBRARY_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Error while trying to open Library",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.CREATE_LIBRARY_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Error while trying to create Library",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ROOT_GROUP_FETCH_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Unexpected error while fetching collections/groups",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ITEMS_FETCH_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Unexpected error while fetching items",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ITEMS_MOVE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Unexpected error while moving items to target collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ITEMS_REMOVE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Unexpected error while removing items from collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.IMPORT_FAILED_UNKNOWN: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Unexpected error while importing items",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.IMPORT_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Import failed",
                content: notificationData.data.failureReason,
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.IMPORT_WITH_ERRORS: {
            const message: ReactElement = (
                <ul>
                    {notificationData.data.filesWithErrors.map((entry: ([string, string])) => {
                        return <li>{entry[0] + ": " + entry[1]}</li>;
                    })}
                </ul>
            );
            return {
                id: notificationData.id,
                type: "error",
                title: "Import encountered errors",
                content: message,
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.IMPORT_SUCCESSFUL: {
            return {
                id: notificationData.id,
                type: "success",
                title: "Import successful",
                content: "Imported " + notificationData.data.amountFiles + " files.",
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.IMPORT_STATUS: {
            return {
                id: notificationData.id,
                type: "info",
                title: "Importing...",
                content: notificationData.data
                    ? (notificationData.data.completedFiles + "/" + notificationData.data.totalAmountFiles + " files imported.")
                    : null,
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.COLLECTION_CREATE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to create collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.COLLECTION_MOVE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to move collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.COLLECTION_EDIT_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to edit collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.COLLECTION_DELETE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to delete collection",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.GROUP_CREATE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to create group",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.GROUP_MOVE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to move group",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.GROUP_RENAME_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to rename group",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.GROUP_DELETE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to delete group",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.OPEN_CONFIG_FILE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to open config file",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ATTRIBUTES_EMBED_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to embed attributes",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ATTRIBUTES_EMBED_STATUS: {
            return {
                id: notificationData.id,
                type: "info",
                title: "Embedding...",
                content: notificationData.data
                    ? (notificationData.data.completedItems + "/" + notificationData.data.totalAmountItems + " files embedded.")
                    : null,
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.ATTRIBUTES_EMBED_FINISHED: {
            const message: ReactElement = (
                <>
                    <p>{"Embedded data of " + notificationData.data.amountProcessedItems + " files."}</p>
                    <ul>
                        {notificationData.data.errors.map((entry: ({ itemId: number, filepath: string, error: string })) => {
                            return <li>{entry.filepath + ": " + entry.error}</li>;
                        })}
                    </ul>
                </>
            );
            return {
                id: notificationData.id,
                type: "success",
                title: "Finished Embedding",
                content: message,
                closable: true,
                onClose: () => onClose()
            };
        }

        case AppNotificationType.APP_CONFIG_FETCH_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to fetch application config",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
        case AppNotificationType.APP_CONFIG_UPDATE_FAILED: {
            return {
                id: notificationData.id,
                type: "error",
                title: "Failed to update application config",
                content: errorToString(notificationData.data),
                closable: true,
                onClose: () => onClose()
            };
        }
    }
}

function errorToString(error: any) {
    let errorString: string = String(error);
    if (errorString === "[object Object]") {
        errorString = JSON.stringify(error);
    }
    return errorString;
}
