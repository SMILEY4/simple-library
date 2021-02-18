import * as React from 'react';
import { ReactElement } from 'react';
import { concatClasses, Variant } from '../common';
import "./checkbox.css";
import { FaCheck } from "react-icons/all";
import { Button } from "../button/Button";

export interface CheckboxProps {
    variant: Variant,
    selected: boolean,
    disabled?: boolean,
    onToggle?: (selected: boolean) => void
}

type CheckboxReactProps = React.PropsWithChildren<CheckboxProps>;


export function Checkbox(props: CheckboxReactProps): ReactElement {

    function getClassNames(props: CheckboxReactProps) {
        return concatClasses(
            "checkbox",
            props.disabled === true ? "checkbox-disabled" : null,
        );
    }

    function getIcon(props: CheckboxReactProps) {
        if (props.selected) {
            return <FaCheck />;
        } else {
            return undefined;
        }
    }

    function handleToggle(): void {
        if (props.onToggle && !props.disabled) {
            props.onToggle(!props.selected);
        }
    }

    return (
        <div className={getClassNames(props)}>
            <Button
                variant={props.variant}
                icon={getIcon(props)}
                disabled={props.disabled}
                onAction={handleToggle}
                className={"checkbox-button"}
            />
            <div className={"checkbox-label"}>
                {props.children}
            </div>
        </div>
    );
}
