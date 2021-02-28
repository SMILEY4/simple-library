import * as React from 'react';
import { Component } from 'react';
import { NotificationEntry, NotificationStack } from './NotificationStack';
import { Type } from '../common';


interface SFNotificationStackEntry extends NotificationEntry {
    uid: string,
}

interface SFNotificationStackState {
    notifications: SFNotificationStackEntry[]
}

interface SFNotificationStackProps {
    modalRootId?: string,
    setAddFunction?: (fun: (type: Type,
                            closable: boolean,
                            icon: any,
                            title: string,
                            caption: string | undefined,
                            content: any) => string) => void,
    setRemoveFunction?: (fun: (uid: string) => void) => void,
    setUpdateNotification?: (fun: (uid: string, action: (entry: NotificationEntry) => NotificationEntry) => void) => void

}

export class SFNotificationStack extends Component<SFNotificationStackProps, SFNotificationStackState> {

    constructor(props: Readonly<SFNotificationStackProps>) {
        super(props);
        this.state = {
            notifications: [],
        };
        this.addNotification = this.addNotification.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
        this.updateNotification = this.updateNotification.bind(this);
        this.props.setAddFunction && this.props.setAddFunction(this.addNotification);
        this.props.setRemoveFunction && this.props.setRemoveFunction(this.removeNotification);
        this.props.setUpdateNotification && this.props.setUpdateNotification(this.updateNotification);
    }

    addNotification(type: Type,
                    closable: boolean,
                    icon: any,
                    title: string,
                    caption: string | undefined,
                    content: any): string {
        const uid: string = "" + (Date.now() + Math.random());
        const entry: SFNotificationStackEntry = {
            uid: uid,
            type: Type.PRIMARY,
            icon: icon,
            title: title,
            content: content,
            caption: caption,
            withCloseButton: closable,
            onClose: () => this.removeNotification(uid),
        };
        this.setState({
            notifications: [...this.state.notifications, entry],
        });
        return uid;
    }

    removeNotification(uid: string) {
        this.setState({
            notifications: this.state.notifications.filter(entry => entry.uid !== uid),
        });
    }

    updateNotification(uid: string, action: (entry: NotificationEntry) => NotificationEntry) {
        this.setState({
            notifications: this.state.notifications.map(entry => {
                if (entry.uid === uid) {
                    return {
                        uid: entry.uid,
                        ...action(entry),
                    };
                } else {
                    return entry;
                }
            }),
        });
    }

    render() {
        return (
            <NotificationStack
                modalRootId={this.props.modalRootId}
                notifications={this.state.notifications}
            />
        );
    }
}
