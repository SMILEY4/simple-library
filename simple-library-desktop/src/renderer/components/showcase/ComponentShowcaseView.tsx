import * as React from 'react';
import {useState} from 'react';
import "./showcase.css"
import {ButtonFilled, ButtonGhost, ButtonText} from "_renderer/components/Buttons";
import {HighlightType, StyleType} from "_renderer/components/Common";
import {AiFillCaretRight, AiFillHome} from "react-icons/all";
import {TextField} from "_renderer/components/TextFields";

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0")
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark"
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1"
    return (
        <div className={
            "showcase-view"
            + " theme-" + themeName
            + " background-" + bgNr
        }>
            <div className="showcase-controls">
                <div onClick={() => setTheme("light-0")}>Light-0</div>
                <div onClick={() => setTheme("light-1")}>Light-1</div>
                <div onClick={() => setTheme("dark-0")}>Dark-0</div>
                <div onClick={() => setTheme("dark-1")}>Dark-1</div>
            </div>
            <div className="showcase-content">
                {renderContent()}
            </div>
        </div>
    )

    function renderContent() {
        return (
            <>

                <h3>Text Fields</h3>

                <h5>Styles</h5>
                <ShowcaseRow>
                    <TextField style={StyleType.FILLED} initialText="Filled"/>
                    <TextField style={StyleType.GHOST} bg={bgNr} initialText="Ghost"/>
                    <TextField style={StyleType.TEXT} initialText="Text"/>
                </ShowcaseRow>

                <h5>Filled</h5>
                <ShowcaseRow>
                    <TextField highlight={HighlightType.NONE} style={StyleType.FILLED} placeholder="TextField None"/>
                    <TextField highlight={HighlightType.INFO} style={StyleType.FILLED} placeholder="TextField Info"/>
                    <TextField highlight={HighlightType.SUCCESS} style={StyleType.FILLED} placeholder="TextField Success"/>
                    <TextField highlight={HighlightType.ERROR} style={StyleType.FILLED} placeholder="TextField Error"/>
                    <TextField highlight={HighlightType.WARN} style={StyleType.FILLED} placeholder="TextField Warn"/>
                </ShowcaseRow>
                <ShowcaseRow>
                    <TextField style={StyleType.FILLED}/>
                    <TextField style={StyleType.FILLED} placeholder="Placeholder"/>
                    <TextField style={StyleType.FILLED} initialText="InitialText"/>
                    <TextField style={StyleType.FILLED} disabled={true} placeholder="Disabled"/>
                    <TextField style={StyleType.FILLED} disabled={true} initialText="Disabled Non-Editable"/>
                    <TextField style={StyleType.FILLED} editable={false} initialText="Non-Editable"/>
                </ShowcaseRow>


                <h5>Ghost</h5>
                <ShowcaseRow>
                    <TextField highlight={HighlightType.NONE} style={StyleType.GHOST} bg={bgNr} placeholder="TextField None"/>
                    <TextField highlight={HighlightType.INFO} style={StyleType.GHOST} bg={bgNr} placeholder="TextField Info"/>
                    <TextField highlight={HighlightType.SUCCESS} style={StyleType.GHOST} bg={bgNr} placeholder="TextField Success"/>
                    <TextField highlight={HighlightType.ERROR} style={StyleType.GHOST} bg={bgNr} placeholder="TextField Error"/>
                    <TextField highlight={HighlightType.WARN} style={StyleType.GHOST} bg={bgNr} placeholder="TextField Warn"/>
                </ShowcaseRow>
                <ShowcaseRow>
                    <TextField style={StyleType.GHOST} bg={bgNr}/>
                    <TextField style={StyleType.GHOST} bg={bgNr} placeholder="Placeholder"/>
                    <TextField style={StyleType.GHOST} bg={bgNr} initialText="InitialText"/>
                    <TextField style={StyleType.GHOST} bg={bgNr} disabled={true} placeholder="Disabled"/>
                    <TextField style={StyleType.GHOST} bg={bgNr} disabled={true} initialText="Disabled Non-Editable"/>
                    <TextField style={StyleType.GHOST} bg={bgNr} editable={false} initialText="Non-Editable"/>
                </ShowcaseRow>

                <h5>Text</h5>
                <ShowcaseRow>
                    <TextField style={StyleType.TEXT}/>
                    <TextField style={StyleType.TEXT} placeholder="Placeholder"/>
                    <TextField style={StyleType.TEXT} initialText="InitialText"/>
                    <TextField style={StyleType.TEXT} disabled={true} placeholder="Disabled"/>
                    <TextField style={StyleType.TEXT} disabled={true} initialText="Disabled Non-Editable"/>
                    <TextField style={StyleType.TEXT} editable={false} initialText="Non-Editable"/>
                </ShowcaseRow>

                <h5>With Content</h5>
                <ShowcaseRow>
                    <TextField style={StyleType.FILLED} placeholder="With Button">
                        <ButtonFilled small={true}>Button</ButtonFilled>
                    </TextField>
                    <TextField style={StyleType.FILLED} placeholder="With Icon">
                        <AiFillHome/>
                    </TextField>
                </ShowcaseRow>


                <h3>Buttons</h3>

                <h5>Styles</h5>
                <ShowcaseRow>
                    <ButtonFilled>Filled</ButtonFilled>
                    <ButtonGhost bg={bgNr}>Ghost</ButtonGhost>
                    <ButtonText>Text</ButtonText>
                </ShowcaseRow>


                <h5>Filled</h5>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.NONE}>Button None</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.INFO}>Button Info</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.SUCCESS}>Button Success</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.ERROR}>Button Error</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.WARN}>Button Warn</ButtonFilled>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonFilled>Enabled</ButtonFilled>
                    <ButtonFilled>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                    <ButtonFilled disabled={true}>Disabled</ButtonFilled>
                    <ButtonFilled small={true}>Small</ButtonFilled>
                    <ButtonFilled small={true}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                </ShowcaseRow>

                <h5>Ghost</h5>
                <ShowcaseRow>
                    <ButtonGhost highlight={HighlightType.NONE} bg={bgNr}>Button None</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.INFO} bg={bgNr}>Button Info</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.SUCCESS} bg={bgNr}>Button Success</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.ERROR} bg={bgNr}>Button Error</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.WARN} bg={bgNr}>Button Warn</ButtonGhost>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonGhost bg={bgNr}>Enabled</ButtonGhost>
                    <ButtonGhost bg={bgNr}>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                    <ButtonGhost disabled={true} bg={bgNr}>Disabled</ButtonGhost>
                    <ButtonGhost small={true} bg={bgNr}>Small</ButtonGhost>
                    <ButtonGhost small={true} bg={bgNr}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                </ShowcaseRow>

                <h5>Text</h5>
                <ShowcaseRow>
                    <ButtonText highlight={HighlightType.NONE}>Button None</ButtonText>
                    <ButtonText highlight={HighlightType.INFO}>Button Info</ButtonText>
                    <ButtonText highlight={HighlightType.SUCCESS}>Button Success</ButtonText>
                    <ButtonText highlight={HighlightType.ERROR}>Button Error</ButtonText>
                    <ButtonText highlight={HighlightType.WARN}>Button Warn</ButtonText>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonText>Enabled</ButtonText>
                    <ButtonText>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonText>
                    <ButtonText disabled={true}>Disabled</ButtonText>
                    <ButtonText small={true}>Small</ButtonText>
                    <ButtonText small={true}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonText>
                </ShowcaseRow>

            </>
        )
    }


}

function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className="showcase-row">
            {props.children}
        </div>
    )
}
