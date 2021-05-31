import * as React from "react";
import {ReactElement} from "react";
import {IconType} from "../../base/icon/Icon";
import {BaseProps} from "../../utils/common";
import {ModalBase} from "../modalbase/ModalBase";
import {Box} from "../../layout/box/Box";
import {addPropsToChildren, concatClasses} from "../../../components/common/common";
import {Notification} from "./Notification";

export interface NotificationStackEntry {
    id: string,
    type: "info" | "success" | "warn" | "error",
    icon?: IconType
    title?: string,
    content?: any,
    caption?: string,
    closable?: boolean,
    onClose?: () => void
}


interface NotificationStackProps extends BaseProps {
    modalRootId?: string,
    entries?: NotificationStackEntry[]
    onCloseEntry?: (id: string) => void,
}


export function NotificationStack(props: React.PropsWithChildren<NotificationStackProps>): ReactElement {

    return (
        <ModalBase
            show={true}
            withOverlay={false}
            modalRootId={props.modalRootId}
            position="bottom"
            className="notification-stack-modal"
            ignorePointerEvents
            showOverflow
        >
            <Box
                dir="up"
                spacing="0-75"
                alignCross="center"
                className={concatClasses( props.className, "notification-stack")}
                style={{...props.style, pointerEvents: "none"}}
                forwardRef={props.forwardRef}
            >
                {getContent()}
            </Box>
        </ModalBase>
    );


    function getContent(): ReactElement[] {
        if (props.entries) {
            return getFromEntries();
        } else {
            return getFromChildren();
        }
    }


    function getFromChildren(): ReactElement[] {
        return addPropsToChildren(
            props.children,
            prevProps => ({
                ...prevProps,
                className: concatClasses(prevProps.className, "with-shadow-2"),
                style: {...prevProps.style, pointerEvents: "all"}
            }),
            child => child.type === Notification
        );
    }

    function getFromEntries(): ReactElement[] {
        return props.entries.map(buildNotification);
    }

    function buildNotification(entry: NotificationStackEntry): ReactElement {
        return (
            <Notification
                type={entry.type}
                icon={entry.icon}
                title={entry.title}
                caption={entry.caption}
                closable={entry.closable}
                className={"with-shadow-2"}
                onClose={() => {
                    entry.onClose && entry.onClose();
                    props.onCloseEntry && props.onCloseEntry(entry.id);
                }}
            >
                {entry.content}
            </Notification>
        );
    }

}
