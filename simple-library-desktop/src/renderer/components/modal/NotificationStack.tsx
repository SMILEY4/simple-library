import * as React from "react";
import {Notification, NotificationProps} from "_renderer/components/modal/Notification";
import {ModalBase, ModalPosition} from "_renderer/components/modal/ModalBase";
import "./notificationStack.css"

interface NotificationEntry extends NotificationProps {
    content?: any,
}

interface NotificationStackProps {
    notifications: NotificationEntry[]
    modalRootId?: string
}

export function NotificationStack(props: React.PropsWithChildren<NotificationStackProps>): React.ReactElement {
    console.log("RENDER STACK: " + props.notifications.length + "  " + JSON.stringify(props.notifications))
    console.log("  MODAL ROOT: " + document.getElementById(props.modalRootId ? props.modalRootId : ""))
    return (
        <ModalBase show={true}
                   position={ModalPosition.BOTTOM}
                   withOverlay={false}
                   withShadow={false}
                   modalRootId={props.modalRootId}
                   className={"notification-stack-modal"}>
            <div className={"notification-stack"}>
                {
                    props.notifications.map((n, index) => {
                        return (
                            <Notification {...n} key={index}>
                                {n.content}
                            </Notification>
                        )
                    })
                }
            </div>
        </ModalBase>
    )

}
