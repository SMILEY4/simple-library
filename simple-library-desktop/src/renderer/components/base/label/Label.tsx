import * as React from 'react';
import {ReactElement} from 'react';
import {HBox} from '../../layout/box/Box';
import {addPropsToChildren, BaseProps, ColorType, concatClasses, map, orDefault, Size} from '../../common/common';
import {Icon} from '../icon/Icon';

interface LabelProps extends BaseProps {
    color?: ColorType,
    spacing?: Size,
}


/**
 * Displays and handles a no editable text with optional icons and other elements.
 * The given color will also automatically be applied to any icon inside the label.
 */
export function Label(props: React.PropsWithChildren<LabelProps>): ReactElement {

    return (
        <HBox
            spacing={props.spacing ? props.spacing : Size.S_0_25}
            className={getClassName()} style={props.style} forwardRef={props.forwardRef}
        >
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
        return addPropsToChildren(
            props.children,
            (prevProps: any) => ({...prevProps, color: getContentColor()}),
            (child: ReactElement) => child.type === Icon,
        );
    }

}
