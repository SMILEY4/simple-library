import * as React from 'react';
import { ReactElement } from 'react';
import { HBox } from '../layout/Box';
import { AlignCross, AlignMain, BaseProps, ColorType, concatClasses, map, orDefault, Size } from '../common';
import { Icon } from '../icon/Icon';

interface LabelProps extends BaseProps {
    icon?: any,
    iconRight?: any,
    color?: ColorType,
}


export function Label(props: React.PropsWithChildren<LabelProps>): ReactElement {

    return (
        <HBox alignMain={AlignMain.CENTER}
              alignCross={AlignCross.CENTER}
              className={concatClasses("label", props.className)}
              spacing={Size.S_0_5}
              style={props.style}
        >
            {renderLeftIcon()}
            {renderCenterContent()}
            {renderRightIcon()}
        </HBox>
    );

    function renderCenterContent(): ReactElement | null {
        return props.children && (
            <div className={"label-content " + map(getContentColor(), color => "text-color-" + color)}>
                {props.children}
            </div>
        );
    }

    function renderLeftIcon(): ReactElement | null {
        return props.icon
            ? (
                <Icon
                    type={props.icon}
                    color={getContentColor()}
                    size={Size.S_1}
                    className={"label-icon"}
                />
            )
            : null;
    }

    function renderRightIcon(): ReactElement | null {
        return props.iconRight
            ? (
                <Icon
                    type={props.iconRight}
                    color={getContentColor()}
                    size={Size.S_1}
                    className={"label-icon-right"}
                />
            )
            : null;
    }

    function getContentColor(): ColorType {
        return orDefault(props.color, ColorType.TEXT_2);
    }

}
