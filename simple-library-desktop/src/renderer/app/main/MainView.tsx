import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dir, Fill, Type } from '../../components/common';
import { Grid } from '../../components/layout/Grid';
import { SFNotificationStack } from '../../components/notification/SFNotificationStack';
import { Box } from '../../components/layout/Box';
import { NotificationEntry } from '../../components/notification/NotificationStack';

export enum MainViewMessageType {
    FETCH_GROUPS_AND_COLLECTIONS_FAILED,
    FETCH_TOTAL_ITEM_COUNT_FAILED,
    FETCH_ITEMS_FAILED,
    MOVE_ITEMS_IN_COLLECTION_FAILED,
    REMOVE_ITEMS_FROM_COLLECTION_FAILED,
    IMPORT_FAILED_UNKNOWN,
    IMPORT_FAILED,
    IMPORT_WITH_ERRORS,
    IMPORT_SUCCESSFUL,
    IMPORT_STATUS,
}

interface MainViewProps {
    setShowNotification: (fun: (type: MainViewMessageType, data: any) => string) => void,
    setUpdateNotification: (fun: (notificationId: string, type: MainViewMessageType, data: any) => void) => void,
    setRemoveNotification: (fun: (notificationId: string) => void) => void,
}

export class MainView extends Component<MainViewProps> {

    addNotificationEntry: (type: Type, closable: boolean, title: string, content: any) => string;
    updateNotificationEntry: (uid: string, action: (entry: NotificationEntry) => NotificationEntry) => void;

    constructor(props: MainViewProps) {
        super(props);
        this.showNotification = this.showNotification.bind(this);
        this.updateNotification = this.updateNotification.bind(this);
        this.errorToString = this.errorToString.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.props.setShowNotification(this.showNotification);
        this.props.setUpdateNotification(this.updateNotification);
    }

    render() {
        return (
            <Box dir={Dir.DOWN}>
                <Grid columns={['auto', '1fr']}
                      rows={['100vh']}
                      fill={Fill.TRUE}
                      style={{ maxHeight: "100vh" }}>
                    {this.props.children}
                </Grid>
                <SFNotificationStack modalRootId='root'
                                     setAddSimpleFunction={(fun) => this.addNotificationEntry = fun}
                                     setUpdateNotification={(fun) => this.updateNotificationEntry = fun}
                                     setRemoveFunction={(fun) => this.props.setRemoveNotification(fun)}
                />
            </Box>
        );
    }

    showNotification(type: MainViewMessageType, data: any): string {
        switch (type) {
            case MainViewMessageType.FETCH_GROUPS_AND_COLLECTIONS_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Unexpected error when fetching collections,groups", this.errorToString(data));
            }
            case MainViewMessageType.FETCH_TOTAL_ITEM_COUNT_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Unexpected error when fetching total item count", this.errorToString(data));
            }
            case MainViewMessageType.FETCH_ITEMS_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Unexpected error when fetching items", this.errorToString(data));
            }
            case MainViewMessageType.MOVE_ITEMS_IN_COLLECTION_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Unexpected error while moving items to collection", this.errorToString(data));
            }
            case MainViewMessageType.REMOVE_ITEMS_FROM_COLLECTION_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Unexpected error while removing items from collection", this.errorToString(data));
            }
            case MainViewMessageType.IMPORT_FAILED_UNKNOWN: {
                return this.addNotificationEntry(Type.ERROR, true, "Import failed unexpectedly", this.errorToString(data));
            }
            case MainViewMessageType.IMPORT_FAILED: {
                return this.addNotificationEntry(Type.ERROR, true, "Import failed", data.failureReason);
            }
            case MainViewMessageType.IMPORT_WITH_ERRORS: {
                const message: ReactElement = (
                    <ul>
                        {data.filesWithErrors.map((entry: ([string, string])) => <li>{entry[0] + ": " + entry[1]}</li>)}
                    </ul>
                );
                return this.addNotificationEntry(Type.WARN, true, "Import encountered errors", message);
            }
            case MainViewMessageType.IMPORT_SUCCESSFUL: {
                return this.addNotificationEntry(Type.SUCCESS, true, "Import successful", "Imported " + data.amountFiles + " files.");
            }
            case MainViewMessageType.IMPORT_STATUS: {
                return this.addNotificationEntry(Type.PRIMARY, true, "Importing...", null);
            }
        }
    }

    updateNotification(notificationId: string, type: MainViewMessageType, data: any): void {
        this.updateNotificationEntry(notificationId, (entry: NotificationEntry) => {
            switch (type) {
                case MainViewMessageType.IMPORT_STATUS: {
                    entry.content = data.completedFiles + "/" + data.totalAmountFiles + " files imported.";
                    break;
                }
            }
            return entry;
        });
    }

    errorToString(error: any) {
        let errorString: string = String(error);
        if (errorString === "[object Object]") {
            errorString = JSON.stringify(error);
        }
        return errorString;
    }

}