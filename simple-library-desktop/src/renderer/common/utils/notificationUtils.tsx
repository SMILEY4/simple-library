import { NotificationEntry } from '../../components/notification/NotificationStack';
import { Type } from '../../components/common';
import { AppNotification, AppNotificationType } from '../../store/state';
import React, { ReactElement } from 'react';


export function genNotificationId(): string {
    return "" + (Date.now() + Math.random());
}


export function toNotificationEntries(notificationData: AppNotification[], onClose: (id: string) => void): NotificationEntry[] {
    return notificationData.map((notification: AppNotification) => toNotificationEntry(notification, () => onClose(notification.id)));
}


export function toNotificationEntry(notificationData: AppNotification, onClose: () => void): NotificationEntry {

    switch (notificationData.type) {
        case AppNotificationType.ROOT_GROUP_FETCH_FAILED: {
            return {
                type: Type.ERROR,
                title: "Unexpected error while fetching collections/groups",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.ITEMS_FETCH_FAILED: {
            return {
                type: Type.ERROR,
                title: "Unexpected error while fetching items",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.ITEMS_MOVE_FAILED: {
            return {
                type: Type.ERROR,
                title: "Unexpected error while moving items to target collection",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.ITEMS_REMOVE_FAILED: {
            return {
                type: Type.ERROR,
                title: "Unexpected error while removing items from collection",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.IMPORT_FAILED_UNKNOWN: {
            return {
                type: Type.ERROR,
                title: "Unexpected error while importing items",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.IMPORT_FAILED: {
            return {
                type: Type.ERROR,
                title: "Import failed",
                content: notificationData.data.failureReason,
                withCloseButton: true,
                onClose: () => onClose(),
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
                type: Type.WARN,
                title: "Import encountered errors",
                content: message,
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.IMPORT_SUCCESSFUL: {
            return {
                type: Type.SUCCESS,
                title: "Import successful",
                content: "Imported " + notificationData.data.amountFiles + " files.",
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.IMPORT_STATUS: {
            return {
                type: Type.PRIMARY,
                title: "Importing...",
                content: notificationData.data
                    ? (notificationData.data.completedFiles + "/" + notificationData.data.totalAmountFiles + " files imported.")
                    : null,
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.COLLECTION_CREATE_FAILED: {
            return {
                type: Type.ERROR,
                title: "Failed to create collection",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
            };
        }
        case AppNotificationType.GROUP_CREATE_FAILED: {
            return {
                type: Type.ERROR,
                title: "Failed to create group",
                content: errorToString(notificationData.data),
                withCloseButton: true,
                onClose: () => onClose(),
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
