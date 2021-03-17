import * as React from 'react';
import { useState } from 'react';
import "./showcase.css";
import {
    AiFillCaretRight,
    AiFillFolder,
    AiFillHome,
    AiOutlineAlignCenter,
    AiOutlineAlignLeft,
    AiOutlineAlignRight,
    AiOutlineSearch,
} from 'react-icons/all';
import { GroupPosition, Type, Variant } from '../common';
import { LabelBox } from '../text/LabelBox';
import { Button } from '../button/Button';
import { Text, TextVariant } from '../text/Text';
import { SFInputField } from '../inputfield/SFInputField';
import { SFToggleButton } from '../button/togglebutton/SFToggleButton';
import { Dialog } from '../modal/Dialog';
import { Image, ImageMode } from "../image/Image";
import forest from "./forest.jpg";
import { SFCheckbox } from "../checkbox/SFCheckbox";
import { ChoiceBox } from "../choicebox/ChoiceBox";
import { Notification } from '../notification/Notification';
import { SFDropdownButton } from '../button/dropdownbutton/SFDropdownButton';

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0");
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark";
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1";
    return (
        <div className={
            "_showcase-view"
            + " theme-" + themeName
            + " background-" + bgNr
        }>
            <div className='showcase-controls'>
                <div onClick={() => setTheme("light-0")}>Light-0</div>
                <div onClick={() => setTheme("light-1")}>Light-1</div>
                <div onClick={() => setTheme("dark-0")}>Dark-0</div>
                <div onClick={() => setTheme("dark-1")}>Dark-1</div>
            </div>
            <div className='showcase-content' id='showcase-content'>
                {renderContent()}
            </div>
        </div>
    );

    function renderDropdownButton() {
        return (
            <>
                <h3>Dropdown Button</h3>

                <SFDropdownButton
                    variant={Variant.OUTLINE}
                    items={["Create", "Update", "Delete"]}
                    selectedItem={"Create"}
                >
                    Dropdown
                </SFDropdownButton>

            </>
        );
    }

    function renderNotification() {
        return (
            <>
                <h3>Notification</h3>

                <Notification type={Type.PRIMARY}
                              icon={<AiFillHome />}
                              title={"Notification Title"}
                              caption={"18.02.2021"}
                              withCloseButton={true}>
                    This is an example info/primary notification.
                </Notification>

                <Notification type={Type.SUCCESS}
                              icon={<AiFillHome />}
                              title={"Notification Title"}
                              caption={"18.02.2021"}
                              withCloseButton={true}>
                    This is an example success notification.
                </Notification>

                <Notification type={Type.ERROR}
                              icon={<AiFillHome />}
                              title={"Notification Title"}
                              caption={"18.02.2021"}
                              withCloseButton={true}>
                    This is an example error notification.
                </Notification>

                <Notification type={Type.WARN}
                              icon={<AiFillHome />}
                              title={"Notification Title"}
                              caption={"18.02.2021"}
                              withCloseButton={true}>
                    This is an example warn notification.
                </Notification>

                {/*<NotificationStack notifications={[*/}
                {/*    {*/}
                {/*        type: Type.PRIMARY,*/}
                {/*        content: "Primary notification on the stack.",*/}
                {/*    },*/}
                {/*    {*/}
                {/*        type: Type.ERROR,*/}
                {/*        content: "Error notification on the stack.",*/}
                {/*    },*/}
                {/*    {*/}
                {/*        type: Type.WARN,*/}
                {/*        content: "Warn notification on the stack.",*/}
                {/*    },*/}
                {/*]} />*/}

            </>
        );
    }


    function renderSidebarMenu() {
        return (
            <>
                {/*<h3>SidebarMenu</h3>*/}

                {/*<ShowcaseRow>*/}

                {/*    <div style={{ height: "200px", border: "1px solid blue" }}>*/}
                {/*        <SFSidebarMenu*/}
                {/*            elements={[*/}
                {/*                {*/}
                {/*                    text: "Home",*/}
                {/*                    icon: <AiOutlineHome />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Team",*/}
                {/*                    icon: <AiOutlineTeam />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "All Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*            ]}*/}
                {/*            align={AlignMain.CENTER}*/}
                {/*            fillHeight*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*    <div style={{ height: "200px", border: "1px solid blue" }}>*/}
                {/*        <SFSidebarMenu*/}
                {/*            elements={[*/}
                {/*                {*/}
                {/*                    text: "Home",*/}
                {/*                    icon: <AiOutlineHome />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Team",*/}
                {/*                    icon: <AiOutlineTeam />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "All Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*            ]}*/}
                {/*            align={AlignMain.CENTER}*/}
                {/*            fillHeight*/}
                {/*            minimizable*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*    <div style={{ height: "200px", border: "1px solid blue" }}>*/}
                {/*        <SFSidebarMenu*/}
                {/*            elements={[*/}
                {/*                {*/}
                {/*                    text: "Home",*/}
                {/*                    icon: <AiOutlineHome />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Team",*/}
                {/*                    icon: <AiOutlineTeam />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    text: "Projects",*/}
                {/*                    icon: <FiFolder />,*/}
                {/*                },*/}
                {/*            ]}*/}
                {/*            align={AlignMain.START}*/}
                {/*            fillHeight*/}
                {/*            minimizable*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*</ShowcaseRow>*/}
            </>
        );
    }

    function renderChoiceBox() {

        const itemsArray = [
            "Austria",
            "Belgium",
            "Bulgaria",
            "Croatia",
            "Cyprus",
            "Czechia",
            "Denmark",
            "Estonia",
            "Finland",
            "France",
            "Germany",
            "Greece",
            "Hungary",
            "Ireland",
            "Italy",
            "Latvia",
            "Lithuania",
            "Luxemburg",
            "Malta",
            "Netherlands",
            "Poland",
            "Portugal",
            "Romania",
            "Slovakia",
            "Slovenia",
            "Spain",
            "Sweden",
        ];

        return (
            <>
                <h3>ChoiceBox</h3>
                <ShowcaseRow>
                    <ChoiceBox
                        variant={Variant.SOLID}
                        items={itemsArray}
                        selected='Germany'
                        // itemFilter={(item) => item.startsWith("S")}
                        maxVisibleItems={6}
                        autoWidth={true}
                    />
                    <ChoiceBox
                        variant={Variant.OUTLINE}
                        items={itemsArray}
                        selected='Germany'
                        // itemFilter={(item) => item.startsWith("S")}
                        maxVisibleItems={6}
                        autoWidth={true}
                    />
                    <ChoiceBox
                        variant={Variant.GHOST}
                        items={itemsArray}
                        selected='Germany'
                        // itemFilter={(item) => item.startsWith("S")}
                        maxVisibleItems={6}
                        autoWidth={true}
                    />
                </ShowcaseRow>
            </>
        );

    }


    function renderCheckbox() {
        return (
            <>
                <h3>Checkbox</h3>
                <ShowcaseRow>
                    <SFCheckbox variant={Variant.OUTLINE} selected={true} />
                    <SFCheckbox variant={Variant.OUTLINE} selected={false} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <SFCheckbox disabled={true} variant={Variant.OUTLINE} selected={true} />
                    <SFCheckbox disabled={true} variant={Variant.OUTLINE} selected={false} />
                </ShowcaseRow>
            </>
        );
    }

    function renderImage() {
        return (
            <>
                <h3>Image</h3>

                <ShowcaseRow fullWidth>
                    <div style={{display: 'grid', width: '50%', height: '150px',}}>
                        <Image url={forest} mode={ImageMode.AUTO} color="red">
                            Mode Auto
                        </Image>
                    </div>
                    <div style={{display: 'grid', width: '50%', height: '150px',}}>
                        <Image url={forest} mode={ImageMode.CONTAIN} color="red">
                            Mode Contain
                        </Image>
                    </div>
                    <div style={{display: 'grid', width: '50%', height: '150px',}}>
                        <Image url={forest} mode={ImageMode.COVER} color="red">
                            Mode Cover
                        </Image>
                    </div>
                </ShowcaseRow>

            </>
        );
    }

    function renderDialogs() {
        return (
            <>
                <h3>Dialogs</h3>
                <ToggleableShowcase text='Open'>
                    <Dialog show={true}
                            title={"Some rather or lets say very long title"}
                            closeButton={true}
                            onClose={() => console.log("DialogAction: Close")}
                            actions={[
                                {
                                    variant: Variant.OUTLINE,
                                    content: "Cancel",
                                    onAction: () => console.log("DialogAction: Cancel"),
                                },
                                {
                                    variant: Variant.SOLID,
                                    type: Type.PRIMARY,
                                    content: "Accept",
                                    onAction: () => console.log("DialogAction: Accept"),
                                },
                            ]}
                    >
                        Test Data
                    </Dialog>
                </ToggleableShowcase>
            </>
        );
    }

    function renderInputField() {
        return (
            <>
                <h3>Input Field</h3>
                <ShowcaseRow>
                    <SFInputField placeholder={"Input"}
                                  value={"Initial"}
                                  onChange={value => console.log("changed:" + value)}
                                  onAccept={value => console.log("accept:" + value)} />
                    <SFInputField disabled={true} value={"Disabled"} />
                    <SFInputField locked={true} value={"Locked"} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <SFInputField icon={<AiOutlineSearch />} placeholder={"Icon Left"} />
                    <SFInputField iconRight={<AiOutlineSearch />} placeholder={"Icon Right"} />
                    <SFInputField icon={<AiFillFolder />} iconRight={<AiOutlineSearch />} placeholder={"Two Icons"} />
                </ShowcaseRow>

                <SFInputField placeholder={"example.com"}
                              contentLeading={
                                  <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.START}>https://</LabelBox>
                              }
                />
                <SFInputField placeholder={"info.example"}
                              contentTrailing={
                                  <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.END}>@email.me</LabelBox>
                              }
                />
                <SFInputField placeholder={"example"}
                              contentLeading={
                                  <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.START}>https://</LabelBox>
                              }
                              contentTrailing={
                                  <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.END}>.com</LabelBox>
                              }
                />

                <SFInputField placeholder={"Input"}
                              icon={<AiOutlineSearch />}
                              contentTrailing={
                                  <Button variant={Variant.SOLID} groupPos={GroupPosition.END}>Search</Button>
                              }
                />

            </>
        );
    }

    function renderButtonRow(type?: Type) {
        return (
            <ShowcaseRow>
                <Button type={type} variant={Variant.SOLID}>Solid</Button>
                <Button type={type} variant={Variant.OUTLINE}>Outline</Button>
                <Button type={type} variant={Variant.GHOST}>Ghost</Button>
                <Button type={type} variant={Variant.LINK}>Link</Button>
                <Button type={type} disabled={true} variant={Variant.SOLID}>Solid</Button>
                <Button type={type} disabled={true} variant={Variant.OUTLINE}>Outline</Button>
                <Button type={type} disabled={true} variant={Variant.GHOST}>Ghost</Button>
                <Button type={type} disabled={true} variant={Variant.LINK}>Link</Button>
            </ShowcaseRow>
        );
    }

    function renderToggleButtons() {
        return (
            <>
                <h3>Toggle Buttons</h3>
                <SFToggleButton variant={Variant.SOLID}>Toggle</SFToggleButton>
                <SFToggleButton disabled={true} variant={Variant.SOLID}>Disabled</SFToggleButton>

                <ShowcaseRow>

                    <div style={{ display: 'flex' }}>
                        <SFToggleButton variant={Variant.SOLID} groupPos={GroupPosition.START} icon={
                            <AiOutlineAlignRight />} />
                        <SFToggleButton variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <SFToggleButton variant={Variant.SOLID} groupPos={GroupPosition.END} icon={
                            <AiOutlineAlignLeft />} />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <SFToggleButton variant={Variant.SOLID} type={Type.PRIMARY} groupPos={GroupPosition.START}
                                        icon={
                                            <AiOutlineAlignRight />} />
                        <SFToggleButton variant={Variant.SOLID} type={Type.PRIMARY} groupPos={GroupPosition.MIDDLE}
                                        icon={
                                            <AiOutlineAlignCenter />} />
                        <SFToggleButton variant={Variant.SOLID} type={Type.PRIMARY} groupPos={GroupPosition.END} icon={
                            <AiOutlineAlignLeft />} />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <SFToggleButton variant={Variant.OUTLINE} groupPos={GroupPosition.START} icon={
                            <AiOutlineAlignRight />} />
                        <SFToggleButton variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <SFToggleButton variant={Variant.OUTLINE} groupPos={GroupPosition.END} icon={
                            <AiOutlineAlignLeft />} />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <SFToggleButton variant={Variant.GHOST} groupPos={GroupPosition.START} icon={
                            <AiOutlineAlignRight />} />
                        <SFToggleButton variant={Variant.GHOST} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <SFToggleButton variant={Variant.GHOST} groupPos={GroupPosition.END} icon={
                            <AiOutlineAlignLeft />} />
                    </div>

                </ShowcaseRow>


            </>
        );
    }

    function renderButtons() {
        return (
            <>
                <h3>Buttons</h3>
                {renderButtonRow()}
                {renderButtonRow(Type.PRIMARY)}
                {renderButtonRow(Type.SUCCESS)}
                {renderButtonRow(Type.ERROR)}
                {renderButtonRow(Type.WARN)}
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.OUTLINE} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.GHOST} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.LINK} icon={<AiFillHome />}>With Icon</Button>
                </ShowcaseRow>
                <ShowcaseRow>
                    <Button disabled={true} type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button disabled={true} variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button disabled={true} variant={Variant.OUTLINE} icon={<AiFillHome />}>With Icon</Button>
                    <Button disabled={true} variant={Variant.GHOST} icon={<AiFillHome />}>With Icon</Button>
                    <Button disabled={true} variant={Variant.LINK} icon={<AiFillHome />}>With Icon</Button>
                </ShowcaseRow>
                <Button variant={Variant.SOLID} icon={<AiFillHome />} iconRight={<AiFillCaretRight />}>Two
                    Icons</Button>
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button variant={Variant.OUTLINE} icon={<AiFillHome />} />
                    <Button variant={Variant.GHOST} icon={<AiFillHome />} />
                    <Button variant={Variant.LINK} icon={<AiFillHome />} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <Button square={true} type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button square={true} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button square={true} variant={Variant.OUTLINE} icon={<AiFillHome />} />
                    <Button square={true} variant={Variant.GHOST} icon={<AiFillHome />} />
                    <Button square={true} variant={Variant.LINK} icon={<AiFillHome />} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.START}>Start</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.START}>Start</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.START} icon={<AiOutlineAlignRight />} />
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.END} icon={<AiOutlineAlignLeft />} />
                    </div>
                </ShowcaseRow>

            </>
        );
    }

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
        );
    }


    function renderContent() {
        return (
            <>
                {renderDropdownButton()}
                {renderNotification()}
                {renderSidebarMenu()}
                {renderChoiceBox()}
                {renderCheckbox()}
                {renderImage()}
                {renderDialogs()}
                {renderInputField()}
                {renderToggleButtons()}
                {renderButtons()}
                {renderText()}
            </>
        );
    }
}


function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className={'showcase-row' + (props.fullWidth ? ' showcase-row-full-width' : '')}>
            {props.children}
        </div>
    );
}


function ToggleableShowcase(props: React.PropsWithChildren<any>): any {
    const [show, setShow] = useState(false);
    return (
        <div>
            <button onClick={() => setShow(!show)}>{props.text}</button>
            {
                show
                    ? props.children
                    : null
            }
        </div>
    );
}


function StatefulComponent(props: React.PropsWithChildren<any>): any {
    const [data, setData] = useState(props.initialState);
    return (
        <div>
            <button onClick={() => setData(props.onAction(data))}>{props.title}</button>
            {props.renderContent(data)}
        </div>
    );
}
