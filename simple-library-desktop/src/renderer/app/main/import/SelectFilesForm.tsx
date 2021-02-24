import * as React from 'react';
import { ReactElement } from 'react';
import { BodyText } from '../../../components/text/Text';
import { FileSelectionField } from '../../../components/inputfield/FileSelectionField';

export interface SelectFilesFormProps {
    files: string[],
    onSelectFiles: () => void
}

export function SelectFilesForm(props: React.PropsWithChildren<SelectFilesFormProps>): ReactElement {

    function getFilesSelectionString(files: string[]): string | undefined {
        if (files.length === 0) {
            return undefined;
        } else if (files.length === 1) {
            return files[0];
        } else {
            return files.length + " files selected.";
        }
    }

    return (
        <>
            <BodyText>Select files to import</BodyText>
            <FileSelectionField
                value={getFilesSelectionString(props.files)}
                onAction={props.onSelectFiles}
            />
        </>
    );
}