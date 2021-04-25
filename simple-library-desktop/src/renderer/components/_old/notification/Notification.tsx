import * as React from 'react';
import { CgClose } from 'react-icons/all';
import './notification.css';
import { Size, Type } from '../../common/common';
import { HBox, VBox } from '../../layout/box/Box';

export interface NotificationProps {
    type: Type,
    icon?: any,
    title?: string,
    caption?: string
    withCloseButton?: boolean,
    onClose?: () => void
}

export function Notification(props: React.PropsWithChildren<NotificationProps>): React.ReactElement {

    function renderIcon(): React.ReactElement | null {
        return props.icon
            ? <div className='notification-icon'>{props.icon}</div>
            : null;
    }


    function renderTitle(): React.ReactElement | null {
        return props.title
            ? <h4 className='notification-title'>{props.title}</h4>
            : null;
    }


    function renderContent(): React.ReactElement | null {
        return <div className={'notification-content'}>{props.children}</div>;
    }


    function renderCaption(): React.ReactElement | null {
        return props.caption
            ? <div className='notification-caption'>{props.caption}</div>
            : null;
    }


    function renderCloseButton() {
        if (props.withCloseButton) { // TODO: make real/generic icon-button
            return <CgClose className='notification-close' onClick={() => props.onClose ? props.onClose() : null} />;
        } else {
            return null;
        }
    }


    return (
        <HBox padding={Size.S_0_5} spacing={Size.S_0_5} className={'notification notification-'+props.type} >
            {renderIcon()}
            <VBox spacing={Size.S_0_25} className={'notification-body'}>
                {renderTitle()}
                {renderContent()}
                {renderCaption()}
            </VBox>
            {renderCloseButton()}
        </HBox>
    );
    
}