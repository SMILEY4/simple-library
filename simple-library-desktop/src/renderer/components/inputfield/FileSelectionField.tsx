import * as React from 'react';
import { ReactElement } from 'react';
import { GroupPosition, Variant } from '../common';
import { InputField } from './InputField';
import { AiFillFile } from 'react-icons/all';
import { Button } from '../button/Button';

export interface FileSelectionFieldProps {
    value: string,
    onAction?: () => void,
    disabled?: boolean,
    className?: string,
    invalid?: boolean
}

type FileSelectionFieldReactProps = React.PropsWithChildren<FileSelectionFieldProps>;


export function FileSelectionField(props: FileSelectionFieldReactProps): ReactElement {

    function renderButton(props: FileSelectionFieldReactProps): ReactElement {
        return (
            <Button variant={Variant.SOLID} groupPos={GroupPosition.END} onAction={props.onAction} disabled={props.disabled}>
                Select
            </Button>
        );
    }

    return (
        <InputField
            value={props.value}
            placeholder='Select Files'
            locked={true}
            disabled={props.disabled}
            invalid={props.invalid}
            icon={<AiFillFile />}
            contentTrailing={renderButton(props)}
            className={props.className}
        />
    );
}
