import * as React from 'react';
import { ReactElement } from 'react';
import { BodyText } from '../../../../../../components/base/text/Text';
import {
    displayStringToRenamePartType,
    RENAME_PART_TYPES,
    RenamePart,
    RenamePartType,
    renamePartTypeToDisplayString,
} from '../../../../../../../common/commonModels';
import { HBox, VBox } from '../../../../../../components/layout/box/Box';
import { AlignCross, AlignMain, Fill, Size, Type, Variant } from '../../../../../../components/common/common';
import { ChoiceBox } from '../../../../../../components/_old/choicebox/ChoiceBox';
import { InputField } from '../../../../../../components/_old/inputfield/InputField';
import { Checkbox } from '../../../../../../components/input/checkbox/Checkbox';
import { Grid } from '../../../../../../components/layout/grid/Grid';

export interface RenameFilesFormProps {
    enabled: boolean,
    onToggleEnable: (enabled: boolean) => void,
    renameParts: RenamePart[],
    onSetRenamePartType: (index: number, type: RenamePartType) => void,
    onSetRenamePartValue: (index: number, value: string) => void,
    renameDataInvalid: boolean,
    invalidRenamePartValues: number[]
}

export function RenameFilesForm(props: React.PropsWithChildren<RenameFilesFormProps>): ReactElement {

    return (
        <>
            <Checkbox variant={Variant.OUTLINE}
                      selected={props.enabled}
                      onToggle={props.onToggleEnable}>
                Rename files
            </Checkbox>

            <VBox alignMain={AlignMain.CENTER}
                  alignCross={AlignCross.STRETCH}
                  spacing={Size.S_0_75}
                  padding={Size.S_1}
                  outlined
                  type={props.renameDataInvalid ? Type.ERROR : undefined}
            >

                <Grid columns={['1fr', '1fr', '1fr']} rows={['1fr']} fill={Fill.TRUE} gap={Size.S_0_5}>
                    {
                        props.renameParts.map((renamePart: RenamePart, index: number) => {
                            return renderNamePart(index, renamePart);
                        })
                    }
                </Grid>

                <HBox spacing={Size.S_0_15}>
                    <BodyText disabled={!props.enabled}>Preview: </BodyText>
                    <BodyText disabled={!props.enabled} italic>{filenamePreview(props.renameParts)}</BodyText>
                </HBox>

            </VBox>

        </>
    );

    function renderNamePart(index: number, part: RenamePart) {
        return (
            <VBox spacing={Size.S_0_25} key={index}>
                <ChoiceBox
                    variant={Variant.OUTLINE}
                    items={RENAME_PART_TYPES.map((e: RenamePartType) => renamePartTypeToDisplayString(e))}
                    selected={renamePartTypeToDisplayString(part.type)}
                    onSelect={selected => props.onSetRenamePartType(index, displayStringToRenamePartType(selected))}
                    maxVisibleItems={5}
                    disabled={!props.enabled}
                    autoWidth
                    onTopSide
                />
                <InputField
                    value={(part.type === RenamePartType.NOTHING || part.type === RenamePartType.ORIGINAL_FILENAME) ? "" : part.value}
                    onChange={value => props.onSetRenamePartValue(index, value)}
                    disabled={!props.enabled || part.type === RenamePartType.ORIGINAL_FILENAME || part.type === RenamePartType.NOTHING}
                    invalid={props.invalidRenamePartValues.indexOf(index) !== -1}
                />
            </VBox>
        );
    }

    function filenamePreview(renameParts: RenamePart[]): string {
        let previewFilename: string = "";
        renameParts.forEach(part => {
           switch (part.type) {
               case RenamePartType.NOTHING:
                   break;
               case RenamePartType.TEXT:
                   previewFilename += part.value;
                   break;
               case RenamePartType.NUMBER_FROM:
                   previewFilename += part.value;
                   break;
               case RenamePartType.ORIGINAL_FILENAME:
                   previewFilename += "filename";
                   break;

           }
        });
        return previewFilename + ".jpg";
    }

}