import {addPropsToChildren, AlignCross, BaseProps, concatClasses, Dir, Size, Type} from "../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {Box} from "../../layout/box/Box";
import {ModalBase, ModalPosition} from "../modalbase/ModalBase";
import {Notification} from "../notification/Notification";
import {IconType} from "../../base/icon/Icon";


export interface NotificationStackEntry {
    id: string,
    type: Type,
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
            position={ModalPosition.BOTTOM}
            className={"notification-stack-modal"}
            ignorePointerEvents
        >
            <Box
                dir={Dir.UP}
                spacing={Size.S_0_75}
                alignCross={AlignCross.CENTER}
                className={concatClasses('notification-stack', props.className)}
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
                className: prevProps.className + " with-shadow-2",
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
