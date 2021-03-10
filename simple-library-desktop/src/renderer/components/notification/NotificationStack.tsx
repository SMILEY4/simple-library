import * as React from 'react';
import './notificationStack.css';
import { Notification, NotificationProps } from './Notification';
import { ModalBase, ModalPosition } from '../modal/ModalBase';
import { VBox } from '../layout/Box';
import { AlignCross, Size } from '../common';

export interface NotificationEntry extends NotificationProps {
    content?: any,
}

export interface NotificationStackProps {
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
            <VBox spacing={Size.S_1} className={'notification-stack'} alignCross={AlignCross.CENTER}>
                {
                    props.notifications.map((n, index) => {
                        return (
                            <Notification {...n} key={index}>
                                {n.content}
                            </Notification>
                        );
                    })
                }
            </VBox>
        </ModalBase>
    );

}