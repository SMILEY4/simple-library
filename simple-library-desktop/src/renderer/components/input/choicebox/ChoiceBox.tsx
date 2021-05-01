import { BaseProps, GroupPosition, mergeRefs, Type, Variant } from '../../common/common';
import * as React from 'react';
import { MutableRefObject, ReactElement, useRef, useState } from 'react';
import { ToggleButton } from '../togglebutton/ToggleButton';
import "./choicebox.css";
import { Icon, IconType } from '../../base/icon/Icon';
import { Manager, Popper, Reference } from 'react-popper';
import { sameWidthModifier } from '../../common/popperUtils';
import { useClickOutside, useStateRef } from '../../common/commonHooks';
import { Menu } from '../../menu/menu/Menu';
import { MenuItem } from '../../menu/menuitem/MenuItem';
import { BodyText } from '../../base/text/Text';

export interface ChoiceBoxItem {
    id: string
    value: string,
}

export interface ChoiceBoxProps extends BaseProps {
    items: ChoiceBoxItem[],
    maxVisibleItems?: number,

    variant?: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    error?: boolean,
    disabled?: boolean,
}

export function ChoiceBox(props: React.PropsWithChildren<ChoiceBoxProps>): ReactElement {

    const [isOpen, setOpen, refOpen] = useStateRef(false);
    const [selectedItemId, setSelectedItemId] = useState(props.items[0].id);
    const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);
    const targetRef: MutableRefObject<any> = useRef(null);

    return (
        <Manager>
            <Reference>
                {({ ref }) => {
                    targetRef.current = ref;
                    return (
                        <ChoiceBoxSelector
                            selectMode={isOpen}
                            onToggle={setOpen}
                            possibleValues={props.items.map(i => i.value)}
                            value={getValueById(selectedItemId)}
                            variant={props.variant}
                            type={props.type}
                            groupPos={props.groupPos}
                            error={props.error}
                            disabled={props.disabled}
                            forwardRef={mergeRefs(ref, targetRef)}
                        />
                    );
                }}
            </Reference>
            {isOpen && (
                <Popper placement={"bottom"} modifiers={[sameWidthModifier()]}>
                    {({ ref, style, placement }) => (
                        <div ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
                            <div ref={menuRef} style={{ display: 'inline-block', minWidth: "100%" }}>
                                <ChoiceBoxMenu
                                    onAction={handleSelectItem}
                                    items={props.items}
                                    selectedItemId={selectedItemId}
                                    maxVisibleItems={props.maxVisibleItems ? props.maxVisibleItems : 10}
                                />
                            </div>
                        </div>
                    )}
                </Popper>
            )}
        </Manager>

    );

    function getValueById(itemId: string): string | undefined {
        return props.items
            .filter(item => item.id === itemId)
            .map(item => item.value)
            .find(() => true);
    }

    function handleClickOutside(target: any) {
        if (refOpen.current && targetRef.current && !targetRef.current.contains(target)) {
            setOpen(false);
        }
    }


    function handleSelectItem(itemId: string) {
        if (itemId !== selectedItemId) {
            setSelectedItemId(itemId);
            setOpen(false);
        }
    }

}


export interface ChoiceBoxSelectorProps {
    possibleValues: string[],
    value: string,
    selectMode: boolean,
    onToggle: (selectMode: boolean) => void,
    variant?: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    error?: boolean,
    disabled?: boolean,
    forwardRef?: any;
}


export function ChoiceBoxSelector(props: React.PropsWithChildren<ChoiceBoxSelectorProps>): ReactElement {
    return (
        <ToggleButton
            forceState
            selected={props.selectMode}
            onToggle={props.onToggle}
            variant={props.variant}
            type={props.type}
            groupPos={props.groupPos}
            error={props.error}
            disabled={props.disabled}
            forwardRef={props.forwardRef}
        >
            <div className={"choice-box-selector-values"}>
                <div>{props.value}</div>
                {props.possibleValues.map(v => (<div>{v}</div>))}
            </div>
            {props.selectMode
                ? (<Icon type={IconType.CHEVRON_UP} />)
                : (<Icon type={IconType.CHEVRON_DOWN} />)}
        </ToggleButton>
    );
}


export interface ChoiceBoxMenuProps {
    onAction: (itemId: string) => void,
    items: ChoiceBoxItem[],
    selectedItemId: string,
    maxVisibleItems: number
}


export function ChoiceBoxMenu(props: React.PropsWithChildren<ChoiceBoxMenuProps>): ReactElement {

    const style: React.CSSProperties = props.items.length > props.maxVisibleItems
        ? {
            maxHeight: "calc(var(--s-1-5)*" + props.maxVisibleItems + ")",
            overflowY: "auto",
        }
        : undefined;

    return (
        <Menu onAction={props.onAction} style={style}>
            {props.items.map(item => {
                if (item.id === props.selectedItemId) {
                    return renderSelectedMenuItem(item);
                } else {
                    return renderMenuItem(item);
                }
            })}
        </Menu>
    );

    function renderSelectedMenuItem(item: ChoiceBoxItem) {
        return (
            <MenuItem itemId={item.id} icon={IconType.CHECKMARK}>
                <BodyText bold>
                    {item.value}
                </BodyText>
            </MenuItem>
        );
    }

    function renderMenuItem(item: ChoiceBoxItem) {
        return (
            <MenuItem itemId={item.id}>
                <BodyText>
                    {item.value}
                </BodyText>
            </MenuItem>
        );
    }

}
