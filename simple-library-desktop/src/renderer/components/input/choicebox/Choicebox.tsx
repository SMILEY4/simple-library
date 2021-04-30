import * as React from 'react';
import { ReactElement, useState } from 'react';
import { BaseProps } from '../../common/common';
import { Manager, Popper, Reference } from 'react-popper';
import "./choicebox.css";
import { ToggleButton } from '../togglebutton/ToggleButton';
import { BodyText } from '../../base/text/Text';


export interface ChoiceBoxProps extends BaseProps {
}


export function ChoiceBox(props: React.PropsWithChildren<ChoiceBoxProps>): ReactElement {

    const [open, setOpen] = useState(false);

    return (
        <Manager>

            <Reference>
                {({ ref }) => (
                    <ToggleButton forwardRef={ref} onToggle={setOpen} switchContent>
                        <BodyText>
                            Show
                        </BodyText>
                        <BodyText>
                            Hide
                        </BodyText>
                    </ToggleButton>
                )}
            </Reference>

            {open && (
                <Popper placement={"auto"}>
                    {({ ref, style, placement, arrowProps }) => (
                        <div ref={ref} style={style} data-placement={placement}>
                            Popper element
                            <div ref={arrowProps.ref} style={arrowProps.style} />
                        </div>
                    )}
                </Popper>
            )}

        </Manager>
    );


}
