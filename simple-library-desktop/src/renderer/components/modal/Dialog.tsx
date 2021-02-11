import * as React from "react";
import { ReactElement } from "react";
import { ModalBase, ModalBaseProps, ModalPosition } from './ModalBase';
import { AlignCross, AlignMain, concatClasses, Size, Variant } from '../common';
import "./dialog.css";
import { H3Text } from '../text/Text';
import { Button, ButtonProps } from '../button/Button';
import { CgClose } from 'react-icons/cg';
import { HBox } from '../layout/Box';

interface DialogActionProps extends ButtonProps {
    content?: any
}

interface DialogProps {
    title: string,
    closeButton?: boolean,
    actions?: DialogActionProps[],

    onClose?: () => void,

    show: boolean,
    modalRootId?: string,
    className?: string
}

type DialogReactProps = React.PropsWithChildren<DialogProps>;


export function Dialog(props: DialogReactProps) {

    function getModalBaseProps(props: DialogReactProps): ModalBaseProps {
        return {
            show: props.show,
            position: ModalPosition.CENTER,
            withOverlay: true,
            withShadow: true,
            modalRootId: props.modalRootId,
            className: concatClasses(props.className, "dialog"),
        };
    }

    function renderHeader(props: DialogReactProps): ReactElement {
        return (
            <HBox className={"dialog-header"} alignMain={AlignMain.SPACE_BETWEEN} alignCross={AlignCross.CENTER} spacing={Size.S_1_5}>
                <H3Text className={"dialog-header-title"}>
                    {props.title}
                </H3Text>
                {
                    props.closeButton === true
                        ? <Button variant={Variant.GHOST} icon={<CgClose />} square={true} onAction={props.onClose} />
                        : null
                }
            </HBox>
        );
    }

    function renderBody(props: DialogReactProps): ReactElement {
        if (props.children) {
            return (
                <div className={"dialog-body"}>
                    {props.children}
                </div>
            );
        } else {
            return null;
        }
    }

    function renderFooter(props: DialogReactProps): ReactElement {
        if (props.actions) {
            return (
                <HBox className={"dialog-footer"} alignMain={AlignMain.END} alignCross={AlignCross.CENTER} spacing={Size.S_0_5}>
                    {
                        props.actions.map((buttonProps, index) => {
                            return (
                                <Button {...buttonProps} key={buttonProps.content + index}>
                                    {buttonProps.content}
                                </Button>
                            );
                        })
                    }
                </HBox>
            );
        } else {
            return null;
        }
    }

    return (
        <ModalBase {...getModalBaseProps(props)}>
            {renderHeader(props)}
            {renderBody(props)}
            {renderFooter(props)}
        </ModalBase>
    );

}