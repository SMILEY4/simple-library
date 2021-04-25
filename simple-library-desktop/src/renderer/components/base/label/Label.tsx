import * as React from 'react';
import { ReactElement } from 'react';
import { HBox } from '../../layout/box/Box';
import { BaseProps, ColorType, concatClasses, map, orDefault, Size } from '../../common/common';
import { Icon } from '../icon/Icon';

interface LabelProps extends BaseProps {
    color?: ColorType,
}


/**
 * Displays and handles a no editable text with optional icons and other elements.
 * The given color will also automatically be applied to any icon inside the label.
 */
export function Label(props: React.PropsWithChildren<LabelProps>): ReactElement {

    return (
        <HBox spacing={Size.S_0_25} className={getClassName()} style={props.style}>
            {getModifiedChildren()}
        </HBox>
    );

    function getContentColor(): ColorType {
        return orDefault(props.color, ColorType.TEXT_2);
    }

    function getClassName() {
        return concatClasses(
            "label",
            map(getContentColor(), color => "text-color-" + color),
            props.className,
        );
    }

    function getModifiedChildren() {
        return React.Children.map(props.children, child => {
            if (React.isValidElement(child) && (child as React.ReactElement<any>).type === Icon) {
                return React.cloneElement(child, { color: getContentColor() });
            } else {
                return child;
            }
        });
    }

}
