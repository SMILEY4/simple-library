import * as React from 'react';
import { ReactElement } from 'react';
import { GroupPosition, Variant } from '../common';
import { InputField } from './InputField';
import { GoFileDirectory } from 'react-icons/all';
import { Button } from '../button/Button';

export interface DirectorySelectionFieldProps {
    value: string,
    onAction?: () => void,
    disabled?: boolean,
    invalid?: boolean
    className?: string
}

type DirectorySelectionFieldReactProps = React.PropsWithChildren<DirectorySelectionFieldProps>;


export function DirectorySelectionField(props: DirectorySelectionFieldReactProps): ReactElement {

    function renderButton(props: DirectorySelectionFieldReactProps): ReactElement {
        return (
            <Button variant={Variant.SOLID} groupPos={GroupPosition.END} onAction={props.onAction} disabled={props.disabled}>
                Browse
            </Button>
        );
    }

    return (
        <InputField
            value={props.value}
            placeholder='Browse Directory'
            locked={true}
            disabled={props.disabled}
            invalid={props.invalid}
            icon={<GoFileDirectory />}
            contentTrailing={renderButton(props)}
            className={props.className}
        />
    );
}
