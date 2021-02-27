import * as React from 'react';
import { ReactElement } from 'react';
import { Checkbox } from '../../../components/checkbox/Checkbox';
import { AlignCross, AlignMain, Size, Variant } from '../../../components/common';
import { ImportTargetAction } from '../../../../common/commonModels';
import { VBox } from '../../../components/layout/Box';
import { DirectorySelectionField } from '../../../components/inputfield/DirectorySelectionField';

export interface ImportTargetFormProps {
    action: ImportTargetAction,
    onSelectAction: (action: ImportTargetAction) => void,
    targetDir: string,
    onSelectTargetDir: () => void,
    targetDirInvalid: boolean
}

export function ImportTargetForm(props: React.PropsWithChildren<ImportTargetFormProps>): ReactElement {
    return (
        <>
            <Checkbox variant={Variant.OUTLINE}
                      selected={props.action !== ImportTargetAction.KEEP}
                      onToggle={selected => props.onSelectAction(selected ? ImportTargetAction.MOVE : ImportTargetAction.KEEP)}>
                Copy or move files
            </Checkbox>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>

                <Checkbox variant={Variant.OUTLINE}
                          selected={props.action === ImportTargetAction.MOVE}
                          onToggle={selected => props.onSelectAction(selected ? ImportTargetAction.MOVE : ImportTargetAction.COPY)}
                          disabled={props.action === ImportTargetAction.KEEP}>
                    Move files
                </Checkbox>

                <Checkbox variant={Variant.OUTLINE}
                          selected={props.action === ImportTargetAction.COPY}
                          onToggle={selected => props.onSelectAction(selected ? ImportTargetAction.COPY : ImportTargetAction.MOVE)}
                          disabled={props.action === ImportTargetAction.KEEP}>
                    Copy files
                </Checkbox>

                <DirectorySelectionField
                    value={props.targetDir}
                    onAction={props.onSelectTargetDir}
                    disabled={props.action === ImportTargetAction.KEEP}
                    invalid={props.targetDirInvalid}
                />

            </VBox>

        </>
    );

}