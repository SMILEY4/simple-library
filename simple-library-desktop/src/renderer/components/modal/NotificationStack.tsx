import * as React from 'react';
import './notificationStack.css';
import { NotificationProps } from './Notification';
import { ModalBase, ModalPosition } from './ModalBase';
import { Notification } from './Notification';

interface NotificationEntry extends NotificationProps {
    content?: any,
}

interface NotificationStackProps {
    notifications: NotificationEntry[]
    modalRootId?: string
}

export function NotificationStack(props: React.PropsWithChildren<NotificationStackProps>): React.ReactElement {
    return (
        <ModalBase show={true}
                   position={ModalPosition.BOTTOM}
                   withOverlay={false}
                   withShadow={false}
                   modalRootId={props.modalRootId}
                   className={'notification-stack-modal'}>
            <div className={'notification-stack'}>
                {
                    props.notifications.map((n, index) => {
                        return (
                            <Notification {...n} key={index}>
                                {n.content}
                            </Notification>
                        );
                    })
                }
            </div>
        </ModalBase>
    );

}
