import * as React from 'react';
import { ReactElement } from 'react';
import { Checkbox } from '../../../components/checkbox/Checkbox';
import { AlignCross, AlignMain, Size, Variant } from '../../../components/common';
import { FileTargetAction } from '../../../../common/commonModels';
import { VBox } from '../../../components/layout/Box';
import { DirectorySelectionField } from '../../../components/inputfield/DirectorySelectionField';

export interface ImportTargetFormProps {
    action: FileTargetAction,
    onSelectAction: (action: FileTargetAction) => void,
    targetDir: string,
    onSelectTargetDir: () => void
}

export function ImportTargetForm(props: React.PropsWithChildren<ImportTargetFormProps>): ReactElement {
    return (
        <>
            <Checkbox variant={Variant.OUTLINE}
                      selected={props.action !== FileTargetAction.KEEP}
                      onToggle={selected => props.onSelectAction(selected ? FileTargetAction.MOVE : FileTargetAction.KEEP)}>
                Copy or move files
            </Checkbox>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>

                <Checkbox variant={Variant.OUTLINE}
                          selected={props.action === FileTargetAction.MOVE}
                          onToggle={selected => props.onSelectAction(selected ? FileTargetAction.MOVE : FileTargetAction.COPY)}
                          disabled={props.action === FileTargetAction.KEEP}>
                    Move files
                </Checkbox>

                <Checkbox variant={Variant.OUTLINE}
                          selected={props.action === FileTargetAction.COPY}
                          onToggle={selected => props.onSelectAction(selected ? FileTargetAction.COPY : FileTargetAction.MOVE)}
                          disabled={props.action === FileTargetAction.KEEP}>
                    Copy files
                </Checkbox>

                <DirectorySelectionField
                    value={props.targetDir}
                    onAction={props.onSelectTargetDir}
                    disabled={props.action === FileTargetAction.KEEP}
                />

            </VBox>

        </>
    );

}