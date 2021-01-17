import * as React from 'react';
import {useState} from 'react';
import "./showcase.css"
import {
    AiFillCaretRight,
    AiFillCloseCircle,
    AiFillHome,
    AiOutlineSearch,
    GoFileDirectory,
    WiCloudy,
    WiDayLightning,
    WiDaySunny,
    WiDaySunnyOvercast,
    WiFog,
    WiRain
} from "react-icons/all";
import forest from "./forest.jpg"
import { TextVariant } from '../text/Text';
import { Container } from '../layout/Container';
import { AlignmentCross, AlignmentMain, Direction, HighlightType, StyleType } from '../common';
import { BackgroundImage } from '../image/BackgroundImage';
import { NotificationStack } from '../modal/NotificationStack';
import { ChoiceBox } from '../choicebox/ChoiceBox';
import { Dialog } from '../modal/Dialog';
import { ButtonFilled, ButtonGhost, ButtonText } from '../buttons/Buttons';
import { InputField } from '../inputfield/InputField';
import {Notification} from '../modal/Notification';
import {Text} from '../text/Text';

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
            <div className="showcase-content" id="showcase-content">
                {renderContent()}
            </div>
        </div>
    )

    function renderText() {
        return (
            <>
                <h3>Text</h3>
                <Text variant={TextVariant.H1}>Heading 1</Text>
                <Text variant={TextVariant.H2}>Heading 2</Text>
                <Text variant={TextVariant.H3}>Heading 3</Text>
                <Text variant={TextVariant.H4}>Heading 4</Text>
                <Text variant={TextVariant.H5}>Heading 5</Text>
                <Text variant={TextVariant.BODY}>Body</Text>
                <Text variant={TextVariant.CAPTION}>Caption</Text>
            </>
        )
    }

    function renderContainer() {
        const boxStyle = {
            width: '100px',
            height: '100px',
            border: '1px solid black',
            display: 'grid'
        }
        const styleA = {
            backgroundColor: 'cyan'
        }
        const styleB = {
            backgroundColor: 'yellow'
        }
        return (
            <>

                <h3>Container</h3>

                <h5>Direction</h5>
                <ShowcaseRow>
                    <div>
                        down
                        <div style={boxStyle}>
                            <Container dir={Direction.DOWN}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        up
                        <div style={boxStyle}>
                            <Container dir={Direction.UP}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        left
                        <div style={boxStyle}>
                            <Container dir={Direction.LEFT}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        right
                        <div style={boxStyle}>
                            <Container dir={Direction.RIGHT}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                </ShowcaseRow>

                <h5>Alignment Main axis (primary)</h5>
                <ShowcaseRow>
                    <div>
                        start
                        <div style={boxStyle}>
                            <Container alignMain={AlignmentMain.START}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        center
                        <div style={boxStyle}>
                            <Container alignMain={AlignmentMain.CENTER}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        end
                        <div style={boxStyle}>
                            <Container alignMain={AlignmentMain.END}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        spaced
                        <div style={boxStyle}>
                            <Container alignMain={AlignmentMain.SPACED}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        space between
                        <div style={boxStyle}>
                            <Container alignMain={AlignmentMain.SPACE_BETWEEN}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                </ShowcaseRow>

                <h5>Alignment Cross Axis (secondary)</h5>
                <ShowcaseRow>
                    <div>
                        start
                        <div style={boxStyle}>
                            <Container dir={Direction.RIGHT} alignMain={AlignmentMain.START} alignCross={AlignmentCross.START}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        center
                        <div style={boxStyle}>
                            <Container dir={Direction.RIGHT} alignMain={AlignmentMain.START} alignCross={AlignmentCross.CENTER}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        end
                        <div style={boxStyle}>
                            <Container dir={Direction.RIGHT} alignMain={AlignmentMain.START} alignCross={AlignmentCross.END}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        stretch
                        <div style={boxStyle}>
                            <Container dir={Direction.RIGHT} alignMain={AlignmentMain.START} alignCross={AlignmentCross.STRETCH}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                </ShowcaseRow>


                <h5>Spacing</h5>
                <ShowcaseRow>
                    <div>
                        none
                        <div style={boxStyle}>
                            <Container dir={Direction.DOWN}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        10px
                        <div style={boxStyle}>
                            <Container dir={Direction.DOWN} spacing={"10px"}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                    <div>
                        20%
                        <div style={boxStyle}>
                            <Container dir={Direction.DOWN} spacing={"20%"}>
                                <div style={styleA}>A</div>
                                <div style={styleB}>B</div>
                            </Container>
                        </div>
                    </div>
                </ShowcaseRow>

            </>
        )
    }

    function renderImageBackground() {
        return (
            <>
                <h3>Image (Background)</h3>

                <div style={{display: 'grid', width: '50%', height: '300px',}}>
                    <BackgroundImage url={forest}>
                        Overlay Content
                    </BackgroundImage>
                </div>
            </>
        )
    }

    function renderNotifications() {
        return (
            <>
                <h3>Notifications</h3>

                <Notification gradient={HighlightType.ERROR}
                              icon={<AiFillCloseCircle/>}
                              title={"There were 2 errors with your submission"}
                              caption={"14:25"}
                              withCloseButton={true}>
                    <li>Your password must be at least 8 characters</li>
                    <li>Your password must include at least one number</li>
                </Notification>

                <ShowcaseRow>

                    <Notification gradient={HighlightType.DEFAULT} title={"Default Notification"}>
                        This is a notification.
                    </Notification>

                    <Notification gradient={HighlightType.INFO} title={"Info Notification"}>
                        This is a notification.
                    </Notification>

                    <Notification gradient={HighlightType.SUCCESS} title={"Success Notification"}>
                        This is a notification.
                    </Notification>

                    <Notification gradient={HighlightType.ERROR} title={"Error Notification"}>
                        This is a notification.
                    </Notification>

                    <Notification gradient={HighlightType.WARN} title={"Warn Notification"}>
                        This is a notification.
                    </Notification>

                </ShowcaseRow>

                <ToggleableShowcase text={"Toggle Notification Stack"}>
                    <NotificationStack modalRootId="showcase-content" notifications={[
                        {
                            gradient: HighlightType.INFO,
                            title: "Info Notification on stack"
                        },
                        {
                            gradient: HighlightType.ERROR,
                            title: "Error Notification on stack with longer title"
                        }
                    ]}/>
                </ToggleableShowcase>
            </>
        )
    }

    function renderChoiceBox() {
        return (
            <>
                <h3>Choice Box</h3>

                <ChoiceBox
                    label="With Label"
                    listHeight={8}
                    style={StyleType.FILLED}
                    title={"Select Item"}
                    items={["1.", "Item A", "Item B", "Item C", "Item D", "Item E", "Last Item in the list"]}
                    onSelect={(value) => console.log("Selected " + value)}
                />

                <StatefulComponent
                    title="Next"
                    initialState={1}
                    onAction={(prevData: any) => (prevData + 1) % 6}
                    renderContent={(data: any) => {
                        return (
                            <ChoiceBox
                                style={StyleType.FILLED}
                                title={"Select Item"}
                                initiallySelected={"" + data}
                                items={[
                                    {id: "1", content: <div><WiDayLightning/>Lightning</div>},
                                    {id: "2", content: <div><WiCloudy/>Cloudy</div>},
                                    {id: "3", content: <div><WiDaySunnyOvercast/>Overcast</div>},
                                    {id: "4", content: <div><WiDaySunny/>Sunny</div>},
                                    {id: "5", content: <div><WiFog/>Fog</div>},
                                    {id: "6", content: <div><WiRain/>Rain</div>}
                                ]}
                                onSelect={(value) => console.log("Selected " + value)}
                            />
                        )
                    }}
                />

                <ShowcaseRow>
                    <ChoiceBox
                        style={StyleType.FILLED}
                        title={"Select Item"}
                        items={[
                            {id: "lightning", content: <div><WiDayLightning/>Lightning</div>},
                            {id: "cloudy", content: <div><WiCloudy/>Cloudy</div>},
                            {id: "overcast", content: <div><WiDaySunnyOvercast/>Overcast</div>},
                            {id: "sunny", content: <div><WiDaySunny/>Sunny</div>},
                            {id: "fog", content: <div><WiFog/>Fog</div>},
                            {id: "rain", content: <div><WiRain/>Rain</div>}
                        ]}
                        onSelect={(value) => console.log("Selected " + value)}
                    />
                    <ChoiceBox
                        style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)}
                        title={"Select Item"}
                        items={[
                            {id: "lightning", content: <div><WiDayLightning/>Lightning</div>},
                            {id: "cloudy", content: <div><WiCloudy/>Cloudy</div>},
                            {id: "overcast", content: <div><WiDaySunnyOvercast/>Overcast</div>},
                            {id: "sunny", content: <div><WiDaySunny/>Sunny</div>},
                            {id: "fog", content: <div><WiFog/>Fog</div>},
                            {id: "rain", content: <div><WiRain/>Rain</div>}
                        ]}
                        onSelect={(value) => console.log("Selected " + value)}
                    />
                    <ChoiceBox
                        style={StyleType.TEXT}
                        title={"Select Item"}
                        items={[
                            {id: "lightning", content: <div><WiDayLightning/>Lightning</div>},
                            {id: "cloudy", content: <div><WiCloudy/>Cloudy</div>},
                            {id: "overcast", content: <div><WiDaySunnyOvercast/>Overcast</div>},
                            {id: "sunny", content: <div><WiDaySunny/>Sunny</div>},
                            {id: "fog", content: <div><WiFog/>Fog</div>},
                            {id: "rain", content: <div><WiRain/>Rain</div>}
                        ]}
                        onSelect={(value) => console.log("Selected " + value)}
                    />
                </ShowcaseRow>

            </>
        )
    }

    function renderModals() {
        return (
            <>

                <h3>Modals</h3>

                <ToggleableShowcase text={"Default"}>
                    <Dialog show={true}
                            modalRootId="showcase-content"
                            icon={<AiFillHome/>}
                            title={"Very long Test-Dialog-Title"}
                            withCloseButton={true}
                            footerActions={
                                <>
                                    <ButtonFilled>Cancel</ButtonFilled>
                                    <ButtonFilled highlight={HighlightType.INFO}>Accept</ButtonFilled>
                                </>
                            }
                    >
                        Modal Content
                    </Dialog>
                </ToggleableShowcase>
            </>
        )
    }


    function renderInputFields() {
        return (
            <>
                <h3>Input Fields</h3>

                <ShowcaseRow>
                    <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.INFO}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.SUCCESS}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.ERROR}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.WARN}/>
                </ShowcaseRow>

                <ShowcaseRow>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.DEFAULT}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.INFO}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.SUCCESS}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.ERROR}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.WARN}/>
                </ShowcaseRow>

                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} placeholder={"Placeholder"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Initial"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Initial+Placeholder"} placeholder={"Placeholder"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Non-Editable"} editable={false}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} placeholder={"Disabled"} disabled={true}/>

                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} label={"E-Mail"} placeholder={"you@example.com"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon={<AiFillHome/>}/>

                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon="$" placeholder={"0.00"}/>

                <InputField style={StyleType.FILLED}
                            type={HighlightType.DEFAULT}
                            icon="$" contentTrailing={(
                    <ChoiceBox style={StyleType.GHOST_BG0} title={"?"} items={["USD", "EUR", "CAD"]}/>)}
                            placeholder={"0.00"}
                />


                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon="http://" placeholder={"website.com"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentLeading={
                    <ButtonFilled><GoFileDirectory/>Browse</ButtonFilled>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonFilled>Search</ButtonFilled>}/>
                <ShowcaseRow>
                    <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                        <ButtonFilled><AiOutlineSearch/>Search</ButtonFilled>}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.DEFAULT} contentTrailing={
                        <ButtonFilled><AiOutlineSearch/>Search</ButtonFilled>}/>
                </ShowcaseRow>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonFilled><AiFillHome/>Browse</ButtonFilled>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonGhost bg={bgNr}>Browse</ButtonGhost>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonText>Browse</ButtonText>}/>
            </>
        )
    }


    function renderButtons() {
        return (
            <>
                <h3>Buttons</h3>

                <h5>Styles</h5>
                <ShowcaseRow>
                    <ButtonFilled>Filled</ButtonFilled>
                    <ButtonGhost bg={bgNr}>Ghost</ButtonGhost>
                    <ButtonText>Text</ButtonText>
                </ShowcaseRow>

                <h5>Filled</h5>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.DEFAULT}>Button None</ButtonFilled>
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
                    <ButtonGhost highlight={HighlightType.DEFAULT} bg={bgNr}>Button None</ButtonGhost>
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
                    <ButtonText highlight={HighlightType.DEFAULT}>Button None</ButtonText>
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

    function renderContent() {
        return (
            <>
                {renderText()}
                {renderContainer()}
                {renderImageBackground()}
                {renderNotifications()}
                {renderChoiceBox()}
                {renderModals()}
                {renderInputFields()}
                {renderButtons()}
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


function ToggleableShowcase(props: React.PropsWithChildren<any>): any {
    const [show, setShow] = useState(false)
    return (
        <div>
            <button onClick={() => setShow(!show)}>{props.text}</button>
            {
                show
                    ? props.children
                    : null
            }
        </div>
    )
}


function StatefulComponent(props: React.PropsWithChildren<any>): any {
    const [data, setData] = useState(props.initialState)
    return (
        <div>
            <button onClick={() => setData(props.onAction(data))}>{props.title}</button>
            {props.renderContent(data)}
        </div>
    )
}
