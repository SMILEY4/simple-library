import * as React from 'react';
import { ReactElement, useState } from 'react';
import { ColorType, Size, Variant } from '../../common/common';
import "./checkbox.css";
import { Button } from "../button/Button";
import { Label } from '../../base/label/Label';
import { Icon, IconType } from '../../base/icon/Icon';
import { HBox } from '../../layout/box/Box';

export interface CheckboxProps {
    variant: Variant,
    selected?: boolean,
    forceState?: boolean
    disabled?: boolean,
    error?: boolean,
    onToggle?: (selected: boolean) => void
}


export function Checkbox(props: React.PropsWithChildren<CheckboxProps>): ReactElement {

    const [isSelected, setSelected] = useState(props.selected === true);

    return (
        <HBox spacing={Size.S_0_25} className={"checkbox"}>
            <Button
                variant={props.variant}
                disabled={props.disabled}
                error={props.error}
                onAction={handleToggle}
                className={"checkbox-button"}
            >
                {getIcon()}
            </Button>
            <Label color={props.disabled ? ColorType.TEXT_0 : ColorType.TEXT_2}>
                {props.children}
            </Label>
        </HBox>
    );

    function getIcon() {
        if (props.forceState === true ? props.selected : isSelected) {
            return <Icon type={IconType.CHECKMARK} />;
        } else {
            return undefined;
        }
    }

    function handleToggle(): void {
        if (props.forceState === true) {
            props.onToggle && props.onToggle(!props.selected);
        } else {
            const nextSelected: boolean = !isSelected;
            setSelected(nextSelected);
            props.onToggle && props.onToggle(nextSelected);
        }
    }

}
