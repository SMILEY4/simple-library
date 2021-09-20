import * as React from "react";
import {ReactElement, useState} from "react";
import {Theme} from "../../app/Application";
import "./showcase.css";
import {ShowcaseSection} from "./ShowcaseSection";
import {BaseElementRaised} from "../base/element/BaseElementRaised";
import {BaseElementFlat} from "../base/element/BaseElementFlat";
import {BaseElementInset} from "../base/element/BaseElementInset";
import {Icon, IconType} from "../base/icon/Icon";
import {Label} from "../base/label/Label";
import {LabelBox} from "../base/labelbox/LabelBox";
import {Button} from "../buttons/button/Button";
import {CheckBox} from "../buttons/checkbox/CheckBox";
import {Box, HBox, VBox} from "../layout/box/Box";
import {HSplitPane, SLOT_DIVIDER, VSplitPane} from "../layout/splitpane/SplitPane";
import {SplitPanePanel} from "../layout/splitpane/SplitPanePanel";
import {Divider} from "../layout/splitpane/Divider";
import {MenuButton} from "../buttons/menubutton/MenuButton";
import {Menu} from "../menu/menu/Menu";
import {MenuItem} from "../menu/menuitem/MenuItem";
import {SubMenuItem} from "../menu/submenu/SubMenuItem";
import {SeparatorMenuItem} from "../menu/seperatormenuitem/SeparatorMenuItem";
import {TitleMenuItem} from "../menu/titlemenuitem/TitleMenuItem";
import {ContextMenuWrapper} from "../menu/contextmenu/ContextMenuWrapper";
import {SelectionDisplay} from "../base/selectionDisplay/SelectionDisplay";
import {ChoiceBox, ChoiceBoxItem} from "../buttons/choicebox/ChoiceBox";
import {TextField} from "../input/textfield/TextField";
import {TextArea} from "../input/textarea/TextArea";
import {Card} from "../layout/card/Card";
import {Badge} from "../misc/badge/Badge";
import {useStateRef} from "../utils/commonHooks";
import {Dialog} from "../modals/dialog/Dialog";
import {Notification} from "../modals/notification/Notification";
import {chooseRandom} from "../utils/common";
import {NotificationStack} from "../modals/notification/NotificationStack";
import {Sidebar} from "../misc/sidebar/Sidebar";
import {SidebarItem} from "../misc/sidebar/item/SidebarItem";
import {SidebarSeparator} from "../misc/sidebar/separator/SidebarSeparator";
import {SidebarGroup} from "../misc/sidebar/group/SidebarGroup";
import {SidebarTextField} from "../misc/sidebar/textfield/SidebarTextField";
import {SidebarSection} from "../misc/sidebar/section/SidebarSection";
import {SidebarFooter} from "../misc/sidebar/footer/SidebarFooter";
import {AppLayout} from "../misc/app/AppLayout";
import {DynamicSlot} from "../base/slot/DynamicSlot";
import {Slot} from "../base/slot/Slot";
import {TreeView} from "../misc/tree/TreeView";
import {getTreeData} from "./sampleData";
import {IconButton} from "../buttons/iconbutton/IconButton";
import {Toolbar} from "../misc/toolbar/Toolbar";
import {Spacer} from "../base/spacer/Spacer";
import {Accordion} from "../misc/accordion/Accordion";
import {ToggleTextField} from "../input/textfield/ToggleTextField";
import {EventIds} from "../../../common/events/eventIds";
import {EventBroadcaster} from "../../../common/events/core/eventBroadcaster";
import {DateTimeInput} from "../input/datetime/DateTimeInput";

interface ComponentShowcaseProps {
	theme: Theme,
	onChangeTheme: (theme: Theme) => void
}

const eventBroadcaster = new EventBroadcaster({
	comPartner: {
		partner: "main"
	},
	eventIdPrefix: "r",
	suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID]
});

export function ComponentShowcase(props: React.PropsWithChildren<ComponentShowcaseProps>): ReactElement {

	const [background, setBackground] = useState("2");

	function setTheme(theme: "dark" | "light"): Promise<void> {
		return eventBroadcaster.send(EventIds.SET_THEME, theme);
	}

	return (
		<div className={"showcase theme-" + props.theme + " showcase-background-" + background} id={"showcase-root"}>

			<div className={"showcase-header"}>
				<div onClick={() => {
					setTheme("dark").then(() => props.onChangeTheme(Theme.DARK));
				}}>Dark
				</div>
				<div onClick={() => {
					setTheme("light").then(() => props.onChangeTheme(Theme.DARK));
				}}>Light
				</div>
				<div onClick={() => setBackground("0")}>BG-0</div>
				<div onClick={() => setBackground("1")}>BG-1</div>
				<div onClick={() => setBackground("2")}>BG-2</div>
			</div>

			{renderDateTimeInput()}
			{renderToggleTextField()}
			{renderAccordion()}
			{renderDragAndDrop()}
			{renderToolbar()}
			{renderIconButton()}
			{renderTreeView()}
			{renderAppLayout()}
			{renderSidebar()}
			{renderNotificationStack()}
			{renderNotification()}
			{renderDialogs()}
			{renderBadge()}
			{renderCard()}
			{renderTextArea()}
			{renderTextField()}
			{renderChoiceBox()}
			{renderSelectionDisplay()}
			{renderContextMenu()}
			{renderMenuButton()}
			{renderSplitPane()}
			{renderBox()}
			{renderCheckBox()}
			{renderButtons()}
			{renderLabelBox()}
			{renderLabels()}
			{renderIcons()}
			{renderElementBase()}

		</div>
	);


	function renderDateTimeInput() {
		return <ShowcaseSection title={"DateTimeInput"}>

			<div>
				<DateTimeInput
					onAccept={value => console.log("selected datetime", value)}
					showTimeSelect
				/>
			</div>

		</ShowcaseSection>;
	}


	function renderToggleTextField() {
		return <ShowcaseSection title={"Toggle-Textfield"}>

			<ToggleTextField
				placeholder={"Placeholder"}
				value={"Init Value"}
				onAccept={v => console.log("Accept", v)}
				fillWidth
			/>

		</ShowcaseSection>;
	}


	function renderAccordion() {
		return <ShowcaseSection title={"Accordion"}>
			<VBox
				style={{
					width: "100%",
					height: "400px",
					border: "1px solid black"
				}}
				spacing="0-5"
				padding="0-5"
				alignCross="stretch"
				alignMain="start"
			>

				<Accordion title="First Accordion" label="44">
					This is the body of the first accordion
					<ul>
						<li>
							Lorem ipsum dolor sit amet, consectetuer adipiscing
							elit. Aenean commodo ligula eget dolor. Aenean
							massa.
						</li>
						<li>
							Cum sociis natoque penatibus et magnis dis
							parturient montes, nascetur ridiculus mus. Donec quam
							felis, ultricies nec, pellentesque eu, pretium quis,
							sem.
						</li>
						<li>
							Nulla consequat massa quis enim. Donec pede justo,
							fringilla vel, aliquet nec, vulputate eget, arcu.
						</li>
						<li>
							In enim justo, rhoncus ut, imperdiet a, venenatis
							vitae, justo. Nullam dictum felis eu pede mollis
							pretium. Integer tincidunt.
						</li>
					</ul>

				</Accordion>

				<Accordion title="Second Accordion">
					This is the body of the second accordion
					<ul>
						<li>Lorem ipsum dolor sit amet consectetuer.</li>
						<li>Aenean commodo ligula eget dolor.</li>
						<li>Aenean massa cum sociis natoque penatibus.</li>
					</ul>
				</Accordion>

				<Accordion title="Borderless Accordion" noBorder>
					This is the body of the borderless accordion
					<ul>
						<li>Lorem ipsum dolor sit amet consectetuer.</li>
						<li>Aenean massa cum sociis natoque penatibus.</li>
					</ul>
				</Accordion>

				<Accordion title="Accordion with icon" icon={IconType.HOME} label="932">
					This is the body of the accordion with an icon
					<ul>
						<li>Lorem ipsum dolor sit amet consectetuer.</li>
						<li>Aenean commodo ligula eget dolor.</li>
						<li>Aenean massa cum sociis natoque penatibus.</li>
					</ul>
				</Accordion>


			</VBox>
		</ShowcaseSection>;
	}

	function renderDragAndDrop() {
		return <ShowcaseSection title={"Drag and Drop"}>

			<div
				style={{
					width: "200px",
					height: "40px",
					border: "1px solid black",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
				draggable
				onDragStart={(e: React.DragEvent) => {
					e.dataTransfer.setData("application/json", JSON.stringify({value: "Hello"}));
				}}
			>
				Drag Me!
			</div>

			<div
				style={{
					width: "200px",
					height: "200px",
					border: "1px solid black",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
				onDragOver={(e: React.DragEvent) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "copy";
				}}
				onDrop={(e: React.DragEvent) => {
					e.preventDefault();
					console.log("drop", e.dataTransfer.getData("application/json"));
				}}
			>
				Drag Here!
			</div>

		</ShowcaseSection>;
	}


	function renderToolbar() {
		return <ShowcaseSection title={"Toolbar"}>

			<div style={{
				width: "100%",
				height: "400px",
				border: "1px solid black",
				position: "relative",
				display: "flex"
			}}>

				<Toolbar>
					<IconButton ghost label="Home" icon={IconType.HOME} large/>
					<IconButton ghost label="Directories" icon={IconType.FOLDER} large/>
					<IconButton ghost label="Exit" icon={IconType.CLOSE} large/>
					<Spacer size="max" dir="vertical"/>
					<TextField placeholder={"search"}/>
				</Toolbar>

			</div>

		</ShowcaseSection>;
	}


	function renderIconButton() {
		return <ShowcaseSection title={"Icon Button"}>

			<div style={{display: "flex", gap: "20px"}}>
				<IconButton icon={IconType.HOME}/>
				<IconButton icon={IconType.HOME} large/>
			</div>

			<p>Ghost</p>
			<div style={{display: "flex", gap: "20px"}}>
				<IconButton ghost icon={IconType.HOME}/>
				<IconButton ghost icon={IconType.HOME} large/>
			</div>

			<p>Disabled</p>
			<div style={{display: "flex", gap: "20px"}}>
				<IconButton disabled icon={IconType.HOME}/>
				<IconButton disabled ghost icon={IconType.HOME}/>
			</div>

			<p>Variants</p>
			<div style={{display: "flex", gap: "20px"}}>
				<IconButton icon={IconType.HOME} variant="info"/>
				<IconButton icon={IconType.HOME} variant="success"/>
				<IconButton icon={IconType.HOME} variant="warn"/>
				<IconButton icon={IconType.HOME} variant="error"/>
			</div>

			<p>With Label</p>
			<div style={{display: "flex", gap: "20px"}}>
				<IconButton label="Home" icon={IconType.HOME} large/>
				<IconButton label="Directories" icon={IconType.FOLDER} large/>
				<IconButton label="Exit" icon={IconType.CLOSE} large variant="warn"/>
			</div>

		</ShowcaseSection>;
	}

	function renderTreeView() {
		return <ShowcaseSection title={"Tree"}>
			<div style={{
				width: "200px",
				height: "300px",
				border: "1px solid black",
				position: "relative",
				display: "flex",
				overflow: "auto"
			}}>

				<TreeView
					rootNode={getTreeData()}
					modalRootId={"showcase-root"}
				>
					<DynamicSlot name={"context-menu"}>
						{(nodeId: string) => (
							<Menu>
								<TitleMenuItem title={"Node " + nodeId}/>
								<MenuItem itemId={"home"}><Icon type={IconType.HOME}/>Home</MenuItem>
								<MenuItem itemId={"folder"}><Icon type={IconType.FOLDER}/>Folder</MenuItem>
								<SubMenuItem itemId={"submenu"}>
									<Slot name={"item"}>
										Submenu
									</Slot>
									<Slot name={"menu"}>
										<MenuItem itemId={"home-sub"}><Icon type={IconType.HOME}/>More Home</MenuItem>
										<MenuItem itemId={"checkmark-sub"}><Icon type={IconType.CHECKMARK}/>More
											Checkmark</MenuItem>
									</Slot>
								</SubMenuItem>
								<MenuItem itemId={"checkmark"}><Icon type={IconType.CHECKMARK}/>Checkmark</MenuItem>
							</Menu>
						)}
					</DynamicSlot>
				</TreeView>

			</div>
		</ShowcaseSection>;
	}


	function renderAppLayout() {

		const [expanded, setExpanded] = useState<string[]>([]);

		function handleToggleExpand(nodeId: string, isExpanded: boolean) {
			if (isExpanded) {
				setExpanded([...expanded, nodeId]);
			} else {
				setExpanded(expanded.filter(expandedId => expandedId !== nodeId));
			}
		}

		return <ShowcaseSection title={"AppLayout"}>
			<div style={{
				width: "100%",
				height: "400px",
				border: "1px solid black",
				position: "relative",
				display: "flex"
			}}>

				<AppLayout
					tabsLeft={[
						{
							id: "tab-left-1",
							title: "Tab 1",
							icon: IconType.HOME
						},
						{
							id: "tab-left-2",
							title: "Tab 2",
							icon: IconType.HOME
						}
					]}
					tabsRight={[
						{
							id: "tab-right-1",
							title: "Tab 1",
							icon: IconType.HOME
						},
						{
							id: "tab-right-2",
							title: "Tab 2",
							icon: IconType.HOME
						}
					]}
				>
					<DynamicSlot name="sidebar-left">
						{(tabId: string) => (
							<TreeView
								rootNode={getTreeData()}
								modalRootId={"showcase-root"}
								forceExpanded={expanded}
								onToggleExpand={handleToggleExpand}
							>
								<DynamicSlot name={"context-menu"}>
									{(nodeId: string) => (
										<Menu>
											<TitleMenuItem title={"Node " + nodeId}/>
											<MenuItem itemId={"home"}><Icon type={IconType.HOME}/>Home</MenuItem>
											<MenuItem itemId={"folder"}><Icon type={IconType.FOLDER}/>Folder</MenuItem>
											<SubMenuItem itemId={"submenu"}>
												<Slot name={"item"}>
													Submenu
												</Slot>
												<Slot name={"menu"}>
													<MenuItem itemId={"home-sub"}><Icon type={IconType.HOME}/>More Home</MenuItem>
													<MenuItem itemId={"checkmark-sub"}><Icon type={IconType.CHECKMARK}/>More
														Checkmark</MenuItem>
												</Slot>
											</SubMenuItem>
											<MenuItem itemId={"checkmark"}><Icon
												type={IconType.CHECKMARK}/>Checkmark</MenuItem>
										</Menu>
									)}
								</DynamicSlot>

							</TreeView>
						)}
					</DynamicSlot>
					<DynamicSlot name="sidebar-right">
						{(tabId: string) => <div>{"Show " + tabId}</div>}
					</DynamicSlot>
					<Slot name={"main"}>
						Main Area
					</Slot>
				</AppLayout>
			</div>


			<div style={{
				width: "100%",
				height: "400px",
				border: "1px solid black",
				position: "relative",
				display: "flex"
			}}>
				<AppLayout
					tabsLeft={[
						{
							id: "tab-left-1",
							title: "Tab 1",
							icon: IconType.HOME
						},
						{
							id: "tab-left-2",
							title: "Tab 2",
							icon: IconType.HOME
						}
					]}
				>
					<DynamicSlot name="sidebar-left">
						{(tabId: string) => <div>{"Show " + tabId}</div>}
					</DynamicSlot>
					<Slot name={"main"}>
						Main Area
					</Slot>
				</AppLayout>
			</div>
		</ShowcaseSection>;
	}


	function renderSidebar() {

		const [isMini, setMini] = useState(false);

		return <ShowcaseSection title={"Sidebar"}>

			<div style={{
				width: "100%",
				height: "400px",
				border: "1px solid black",
				position: "relative"
			}}>
				<VSplitPane
					primaryAsPercentage={false}
					primaryCollapsed={isMini}
					onResize={(size: number) => setMini(size && size <= 60)}
					style={{width: "100%", height: "100%"}}
				>
					<SplitPanePanel initialSize={"100px"} minSize={"42px"}>

						<Sidebar mini={isMini}>

							<SidebarSection title={"Items"}>
								<SidebarItem icon={IconType.FOLDER} title="Open"/>
								<SidebarItem icon={IconType.CHECKMARK} title="Verify" label="13421"/>
							</SidebarSection>

							<SidebarSeparator/>

							<SidebarSection title={"Application"}>
								<SidebarItem icon={IconType.CLOSE} title="Close"/>
							</SidebarSection>

							<SidebarSeparator/>

							<SidebarSection scrollable title={"Groups"}>
								<SidebarTextField
									placeholder={"Search..."}
									onChange={value => console.log("Search for", value)}
								/>
								<SidebarGroup icon={IconType.FOLDER} title={"All Items"}>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 2"/>
									<SidebarItem icon={IconType.HOME} title="Collection 3"/>
									<SidebarItem icon={IconType.HOME} title="Collection 4"/>
								</SidebarGroup>
								<SidebarGroup icon={IconType.FOLDER} title={"Holiday 2019"}>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 2"/>
									<SidebarItem icon={IconType.HOME} title="Collection 3"/>
									<SidebarItem icon={IconType.HOME} title="Collection 4"/>
									<SidebarGroup icon={IconType.FOLDER} title={"In Progress"}>
										<SidebarItem icon={IconType.HOME} title="Collection 1"/>
										<SidebarItem icon={IconType.HOME} title="Collection 1"/>
										<SidebarItem icon={IconType.HOME} title="Collection 2"/>
									</SidebarGroup>
								</SidebarGroup>
								<SidebarGroup icon={IconType.FOLDER} title={"Travel 2018"}>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 1"/>
									<SidebarItem icon={IconType.HOME} title="Collection 2"/>
									<SidebarItem icon={IconType.HOME} title="Collection 3"/>
									<SidebarItem icon={IconType.HOME} title="Collection 4"/>
								</SidebarGroup>
							</SidebarSection>

							<SidebarFooter onToggleMini={() => setMini(!isMini)}/>

						</Sidebar>

					</SplitPanePanel>
					<SplitPanePanel initialSize={"100%"} minSize={"100px"}>
						<div style={{backgroundColor: "var(--color-background-2)", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
				</VSplitPane>
			</div>


		</ShowcaseSection>;
	}


	function renderNotificationStack() {

		const [notifications, setNotifications] = useState([]);
		const [notificationIdCounter, setNotificationIdCounter] = useState(0);

		return <ShowcaseSection title={"NotificationStack"}>

			<Button onAction={() => {
				setNotifications([...notifications, {
					id: notificationIdCounter,
					type: chooseRandom(["info", "success", "warn", "error"])
				}]);
				setNotificationIdCounter(notificationIdCounter + 1);
			}}>
				Add Notification
			</Button>

			<NotificationStack>
				{
					notifications.map(notification => {
						return (
							<Notification
								type={notification.type}
								icon={IconType.HOME}
								title={"Notification " + notification.id}
								caption={"Caption"}
								closable
								onClose={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
							>
								Test Notification with a longer text as the content. <br/> This can be anything.
							</Notification>
						);
					})
				}
			</NotificationStack>

		</ShowcaseSection>;
	}


	function renderNotification() {
		return <ShowcaseSection title={"Notifications"}>

			<Notification type="info" icon={IconType.HOME} closable>
				This is a smaller Notification
			</Notification>

			<Notification type="info" icon={IconType.HOME} title="My Notification" caption="26.05.2021 - 16:34"
						  closable>
				This is a notification. Content can be anything
				<li>Text</li>
				<li>Components</li>
				<li>...and more</li>
			</Notification>

			<Notification type="success" icon={IconType.HOME} title="My Notification" caption="26.05.2021 - 16:34"
						  closable>
				This is a notification. Content can be anything
				<li>Text</li>
				<li>Components</li>
				<li>...and more</li>
			</Notification>

			<Notification type="warn" icon={IconType.HOME} title="My Notification" caption="26.05.2021 - 16:34"
						  closable>
				This is a notification. Content can be anything
				<li>Text</li>
				<li>Components</li>
				<li>...and more</li>
			</Notification>

			<Notification type="error" icon={IconType.HOME} title="My Notification" caption="26.05.2021 - 16:34"
						  closable>
				This is a notification. Content can be anything
				<li>Text</li>
				<li>Components</li>
				<li>...and more</li>
			</Notification>

		</ShowcaseSection>;
	}


	function renderDialogs() {

		const [show, setShow, refShow] = useStateRef(false);

		return <ShowcaseSection title={"Dialogs"}>

			<Button onAction={() => setShow(true)}>
				Open
			</Button>

			<Dialog
				show={show}
				icon={IconType.HOME}
				title={"My Dialog Title"}
				onClose={() => setShow(false)}
				withOverlay
				closable
				closeOnClickOutside
			>
				<Slot name={"body"}>
					<TextField onAccept={(value: string) => console.log("accept text", value)}/>
					This is the actual content of the dialog <br/>
					Usually, this goes over multiple lines and can be anything from
					{[0, 1, 2, 3].map(i => [<li>text</li>, <li>tables</li>, <li>forms</li>])}
					<li>...and more</li>
					To close, press the x-button, click outside, press escape or enter
				</Slot>
				<Slot name={"footer"}>
					<Button>Cancel</Button>
					<Button variant="info">Accept</Button>
				</Slot>
			</Dialog>

		</ShowcaseSection>;
	}


	function renderBadge() {
		return <ShowcaseSection title={"Badge"}>

			<div style={{display: "flex", gap: "20px"}}>

				<Badge variant="info">
					<Button>Button</Button>
				</Badge>

				<Badge variant="success">
					<Button>Button</Button>
				</Badge>

				<Badge variant="warn">
					<Button>Button</Button>
				</Badge>

				<Badge variant="error">
					<Button>Button</Button>
				</Badge>

			</div>

			<div style={{display: "flex", gap: "20px"}}>

				<Badge variant="info" text="1235">
					<Button>Button</Button>
				</Badge>

				<Badge variant="success" text="1235">
					<Button>Button</Button>
				</Badge>

				<Badge variant="warn" text="1235">
					<Button>Button</Button>
				</Badge>

				<Badge variant="error" text="1235">
					<Button>Button</Button>
				</Badge>

			</div>

			<div style={{display: "flex", gap: "20px"}}>

				<Badge variant="info" icon={IconType.HOME}>
					<Button>Button</Button>
				</Badge>

				<Badge variant="success" icon={IconType.HOME}>
					<Button>Button</Button>
				</Badge>

				<Badge variant="warn" icon={IconType.HOME}>
					<Button>Button</Button>
				</Badge>

				<Badge variant="error" icon={IconType.HOME}>
					<Button>Button</Button>
				</Badge>
			</div>

		</ShowcaseSection>;
	}


	function renderCard() {
		return <ShowcaseSection title={"Card"}>

			<Card
				icon={IconType.HOME}
				title="My Card Title"
				closable
			>
				<Slot name={"body"}>
					This is the actual content of the card <br/>
					Usually, this goes over multiple lines and can be anything from
					<li>text</li>
					<li>tables</li>
					<li>forms</li>
					<li>...and more</li>
				</Slot>
				<Slot name={"footer"}>
					<CheckBox>Don't show again</CheckBox>
					<Button>Cancel</Button>
					<Button variant="info">Accept</Button>
				</Slot>
			</Card>

		</ShowcaseSection>;
	}


	function renderTextArea() {
		return <ShowcaseSection title={"TextArea"}>
			<TextArea placeholder={"TextArea"}/>
		</ShowcaseSection>;
	}


	function renderTextField() {
		return <ShowcaseSection title={"TextField"}>

			<TextField
				placeholder={"Placeholder"}
				prependIcon={IconType.HOME}
				appendIcon={IconType.CLOSE}
			/>

			<TextField prependIcon={IconType.HOME} disabled placeholder={"Disabled Placeholder"}/>
			<TextField prependIcon={IconType.HOME} disabled value={"Disabled Placeholder"}/>

			<TextField value={"Fixed Value"} forceState/>

			<HBox>
				<LabelBox groupPos="left">www.</LabelBox>
				<TextField value={"example"} groupPos="center"/>
				<ChoiceBox items={[{id: "de", text: ".de"}, {id: "com", text: ".com"}, {
					id: "org",
					text: ".org"
				}]} selectedItemId={"de"} groupPos="right"/>
			</HBox>


		</ShowcaseSection>;
	}


	function renderChoiceBox() {

		const items: ChoiceBoxItem[] = [
			{
				id: "hello",
				text: "Hello!"
			},
			{
				id: "hello-world",
				text: "Hello World"
			},
			{
				id: "hi",
				text: "Hi"
			}
		];

		return <ShowcaseSection title={"ChoiceBox"}>

			<ChoiceBox
				items={items}
				selectedItemId={"hello-world"}
				onAction={itemId => console.log("select item", itemId)}
			/>

			<div style={{display: "flex", gap: "20px"}}>
				<ChoiceBox items={items}/>
				<ChoiceBox items={items} variant="info"/>
				<ChoiceBox items={items} variant="success"/>
				<ChoiceBox items={items} variant="warn"/>
				<ChoiceBox items={items} variant="error"/>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<ChoiceBox items={items} disabled/>
				<ChoiceBox items={items} disabled variant="info"/>
				<ChoiceBox items={items} disabled variant="success"/>
				<ChoiceBox items={items} disabled variant="warn"/>
				<ChoiceBox items={items} disabled variant="error"/>
			</div>

			<ChoiceBox items={items} dynamicSize/>

		</ShowcaseSection>;
	}


	function renderSelectionDisplay() {
		return <ShowcaseSection title={"SelectionDisplay"}>

			<BaseElementFlat>
				<SelectionDisplay align="center">
					<Label>Hello!</Label>
					<Label>Hello World</Label>
					<Label>Hi</Label>
				</SelectionDisplay>
			</BaseElementFlat>

			<BaseElementFlat>
				<SelectionDisplay align="center">
					<Label>Hello World</Label>
					<Label>Hello!</Label>
					<Label>Hi</Label>
				</SelectionDisplay>
			</BaseElementFlat>

			<BaseElementFlat>
				<SelectionDisplay align="center">
					<Label>Hi</Label>
					<Label>Hello!</Label>
					<Label>Hello World</Label>
				</SelectionDisplay>
			</BaseElementFlat>

		</ShowcaseSection>;
	}


	function renderContextMenu() {
		return <ShowcaseSection title={"ContextMenu"}>
			<ContextMenuWrapper onAction={(itemId: string) => console.log("CONTEXT_MENU: " + itemId)}>
				<Slot name={"target"}>
					<LabelBox style={{width: "300px", height: "300px"}}>
						Open Context Menu Here
					</LabelBox>
				</Slot>
				<Slot name={"menu"}>
					<Menu>
						<MenuItem itemId={"home"}><Icon type={IconType.HOME}/>Home</MenuItem>
						<MenuItem itemId={"folder"}><Icon type={IconType.FOLDER}/>Folder</MenuItem>
						<SubMenuItem itemId={"submenu"}>
							<Slot name={"item"}>
								Submenu
							</Slot>
							<Slot name={"menu"}>
								<MenuItem itemId={"home-sub"}><Icon type={IconType.HOME}/>More Home</MenuItem>
								<MenuItem itemId={"checkmark-sub"}><Icon type={IconType.CHECKMARK}/>More
									Checkmark</MenuItem>
							</Slot>
						</SubMenuItem>
						<MenuItem itemId={"checkmark"}><Icon type={IconType.CHECKMARK}/>Checkmark</MenuItem>
					</Menu>
				</Slot>
			</ContextMenuWrapper>
		</ShowcaseSection>;
	}


	function renderMenuButton() {

		return <ShowcaseSection title={"MenuButton"}>

			<MenuButton onAction={(itemId: string) => console.log("Menu Action", itemId)}>
				<Slot name={"button"}>
					Menu Button
				</Slot>
				<Slot name={"menu"}>
					<Menu>
						<TitleMenuItem title={"Actions"}/>
						<MenuItem itemId={"home"} appendIcon={IconType.CHECKMARK}><Icon
							type={IconType.HOME}/>Home</MenuItem>
						<MenuItem itemId={"folder"}><Icon type={IconType.FOLDER}/>Folder</MenuItem>
						<MenuItem itemId={"checkmark"} appendIcon={IconType.CHECKMARK}><Icon type={IconType.CHECKMARK}/>Checkmark</MenuItem>
						<SeparatorMenuItem/>
						<TitleMenuItem title={"Submenu"}/>
						<SubMenuItem itemId={"submenu"}>
							<Slot name={"item"}>
								Submenu
							</Slot>
							<Slot name={"menu"}>
								<MenuItem itemId={"home-sub"}><Icon type={IconType.HOME}/>More Home</MenuItem>
								<MenuItem itemId={"checkmark-sub"}><Icon type={IconType.CHECKMARK}/>More
									Checkmark</MenuItem>
							</Slot>
						</SubMenuItem>
					</Menu>
				</Slot>
			</MenuButton>

		</ShowcaseSection>;

	}


	function renderSplitPane() {
		return <ShowcaseSection title={"SplitPane"}>
			<div style={{
				width: "100%",
				height: "100px",
				border: "1px solid black",
				position: "relative"
			}}>
				<VSplitPane
					primaryAsPercentage={false}
					style={{width: "100%", height: "100%"}}
				>
					<SplitPanePanel initialSize={"100px"} minSize={"30%"}>
						<div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
					<SplitPanePanel initialSize={"100%"} minSize={"100px"}>
						<div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
				</VSplitPane>
			</div>

			<div style={{
				width: "100%",
				height: "100px",
				border: "1px solid black",
				position: "relative"
			}}>
				<VSplitPane
					primaryAsPercentage={true}
					style={{width: "100%", height: "100%"}}
				>
					<SplitPanePanel initialSize={"100px"} minSize={"40px"}>
						<div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
					<SplitPanePanel initialSize={"100%"} minSize={"100px"}>
						<div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
				</VSplitPane>
			</div>

			<div style={{
				width: "100%",
				height: "100px",
				border: "1px solid black",
				position: "relative"
			}}>
				<HSplitPane
					primaryAsPercentage={false}
					style={{width: "100%", height: "100%"}}
				>
					<SplitPanePanel initialSize={"60px"} minSize={"40px"}>
						<div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
					<SplitPanePanel initialSize={"100%"} minSize={"10px"}>
						<div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
				</HSplitPane>
			</div>


			<div style={{
				width: "100%",
				height: "100px",
				border: "1px solid black",
				position: "relative"
			}}>
				<VSplitPane
					primaryAsPercentage={false}
					style={{width: "100%", height: "100%"}}
				>

					<SplitPanePanel initialSize={"60px"} minSize={"40px"}>
						<div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
					</SplitPanePanel>

					<SplitPanePanel initialSize={"100%"} minSize={"40px"}>
						<VSplitPane
							primaryAsPercentage={false}
							style={{width: "100%", height: "100%"}}
						>
							<SplitPanePanel initialSize={"100%"}>
								<div style={{backgroundColor: "#85bcff", width: "100%", height: "100%"}}/>
							</SplitPanePanel>
							<SplitPanePanel initialSize={"60px"} minSize={"40px"} primary>
								<div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
							</SplitPanePanel>
						</VSplitPane>
					</SplitPanePanel>

				</VSplitPane>
			</div>


			<div style={{
				width: "100%",
				height: "100px",
				border: "1px solid black",
				position: "relative"
			}}>
				<VSplitPane style={{width: "100%", height: "100%"}}>
					<Slot name={SLOT_DIVIDER}>
						<Divider style={{
							minWidth: "10px",
							maxWidth: "10px",
							backgroundColor: "lightgray",
							border: "1px solid black"
						}}/>
					</Slot>
					<SplitPanePanel initialSize={"100px"} minSize={"40px"}>
						<div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
					<SplitPanePanel initialSize={"100%"} minSize={"40px"}>
						<div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
					</SplitPanePanel>
				</VSplitPane>
			</div>
		</ShowcaseSection>;
	}


	function renderBox() {
		return <ShowcaseSection title={"Box"}>

			<div style={{display: "flex", gap: "20px"}}>
				<BaseElementFlat>
					<VBox spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="start" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="end" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="stretch" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<BaseElementFlat>
					<HBox spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="start" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="end" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="stretch" spacing="0-5">
						{dummyElement(40, 14)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
			</div>


		</ShowcaseSection>;
	}


	function renderCheckBox() {
		return <ShowcaseSection title={"CheckBox"}>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox>Checkbox</CheckBox>
				<CheckBox disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox selected>Checkbox</CheckBox>
				<CheckBox selected disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox variant="info">Checkbox</CheckBox>
				<CheckBox variant="info" disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox variant="info" selected>Checkbox</CheckBox>
				<CheckBox variant="info" selected disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox forceState>Forced Checkbox</CheckBox>
				<CheckBox forceState selected>Forced Checkbox</CheckBox>
			</div>

		</ShowcaseSection>;
	}


	function renderButtons() {
		return <ShowcaseSection title={"Buttons"}>

			<div style={{display: "flex", gap: "20px"}}>
				<Button onAction={() => console.log("click")}>
					Button
				</Button>
				<Button onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
					Button with icon
				</Button>
				<Button variant="info" onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
					Info Button
				</Button>
				<Button square onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
				</Button>
				<Button error onAction={() => console.log("click")}>
					Invalid
				</Button>
				<Button disabled onAction={() => console.log("click")}>
					Disabled
				</Button>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<Button><Icon type={IconType.HOME}/>Default</Button>
				<Button variant="info"><Icon type={IconType.HOME}/>Info</Button>
				<Button variant="success"><Icon type={IconType.HOME}/>Success</Button>
				<Button variant="warn"><Icon type={IconType.HOME}/>Warn</Button>
				<Button variant="error"><Icon type={IconType.HOME}/>Error</Button>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Button disabled><Icon type={IconType.HOME}/>Default</Button>
				<Button disabled variant="info"><Icon type={IconType.HOME}/>Info</Button>
				<Button disabled variant="success"><Icon type={IconType.HOME}/>Success</Button>
				<Button disabled variant="warn"><Icon type={IconType.HOME}/>Warn</Button>
				<Button disabled variant="error"><Icon type={IconType.HOME}/>Error</Button>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<Button ghost><Icon type={IconType.HOME}/>Ghost Default</Button>
				<Button ghost disabled><Icon type={IconType.HOME}/>Ghost Default</Button>
				<Button ghost variant="info"><Icon type={IconType.HOME}/>Ghost Info</Button>
				<Button ghost disabled variant="info"><Icon type={IconType.HOME}/>Ghost Info</Button>
			</div>


		</ShowcaseSection>;
	}


	function renderLabelBox() {
		return <ShowcaseSection title={"LabelBox"}>
			<LabelBox>
				<Icon type={IconType.HOME}/>
				Label Box
			</LabelBox>
			<LabelBox disabled>
				<Icon type={IconType.HOME}/>
				Disabled Label Box
			</LabelBox>
			<LabelBox error>
				<Icon type={IconType.HOME}/>
				Invalid Label Box
			</LabelBox>
		</ShowcaseSection>;
	}


	function renderLabels() {
		return <ShowcaseSection title={"Labels"}>
			<div style={{display: "flex", gap: "20px"}}>
				<Label>
					Label without Icon
				</Label>
				<Label>
					<Icon type={IconType.HOME}/>
					Label with 2 Icons
					<Icon type={IconType.HOME}/>
				</Label>
				<Label noSelect>
					<Icon type={IconType.HOME}/>
					Label not selectable
				</Label>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label variant="primary"><Icon type={IconType.HOME}/>Primary</Label>
				<Label variant="secondary"><Icon type={IconType.HOME}/>Secondary</Label>
				<Label variant="info"><Icon type={IconType.HOME}/>Info</Label>
				<Label variant="success"><Icon type={IconType.HOME}/>Success</Label>
				<Label variant="warn"><Icon type={IconType.HOME}/>Warn</Label>
				<Label variant="error"><Icon type={IconType.HOME}/>Error</Label>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive>
					<Label variant="on-variant"><Icon type={IconType.HOME}/>On Variant</Label>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label disabled variant="primary"><Icon type={IconType.HOME}/>Primary</Label>
				<Label disabled variant="secondary"><Icon type={IconType.HOME}/>Secondary</Label>
				<Label disabled variant="info"><Icon type={IconType.HOME}/>Info</Label>
				<Label disabled variant="success"><Icon type={IconType.HOME}/>Success</Label>
				<Label disabled variant="warn"><Icon type={IconType.HOME}/>Warn</Label>
				<Label disabled variant="error"><Icon type={IconType.HOME}/>Error</Label>
				<BaseElementRaised style={{padding: "4px"}} variant="info" disabled>
					<Label variant="on-variant" disabled><Icon type={IconType.HOME}/>On Variant</Label>
				</BaseElementRaised>
			</div>

			<Label type="header-1"><Icon type={IconType.HOME}/>Header 1</Label>
			<Label type="header-2"><Icon type={IconType.HOME}/>Header 2</Label>
			<Label type="header-3"><Icon type={IconType.HOME}/>Header 3</Label>
			<Label type="header-4"><Icon type={IconType.HOME}/>Header 4</Label>
			<div style={{display: "flex", gap: "20px"}}>
				<Label type="body"><Icon type={IconType.HOME}/>Body</Label>
				<Label italic type="body"><Icon type={IconType.HOME}/>Body</Label>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label type="caption"><Icon type={IconType.HOME}/>Caption</Label>
				<Label italic type="caption"><Icon type={IconType.HOME}/>Caption</Label>
			</div>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="wrap"><Icon type={IconType.HOME}/>Default i.e. wrap long text</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="nowrap"><Icon type={IconType.HOME}/>Dont wrap long text</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="nowrap-hidden"><Icon type={IconType.HOME}/>Dont wrap long text, hide
					overflow</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="cutoff"><Icon type={IconType.HOME}/>Dont wrap long text, cut off overflow</Label>
			</BaseElementFlat>

		</ShowcaseSection>;
	}


	function renderIcons() {
		return <ShowcaseSection title={"Icons"}>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} color="primary"/>
				<Icon type={IconType.HOME} color="secondary"/>
				<Icon type={IconType.HOME} color="info"/>
				<Icon type={IconType.HOME} color="success"/>
				<Icon type={IconType.HOME} color="warn"/>
				<Icon type={IconType.HOME} color="error"/>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive>
					<Icon type={IconType.HOME} color="on-variant"/>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} disabled color="primary"/>
				<Icon type={IconType.HOME} disabled color="secondary"/>
				<Icon type={IconType.HOME} disabled color="info"/>
				<Icon type={IconType.HOME} disabled color="success"/>
				<Icon type={IconType.HOME} disabled color="warn"/>
				<Icon type={IconType.HOME} disabled color="error"/>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive disabled>
					<Icon type={IconType.HOME} disabled color="on-variant"/>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} size="0-25"/>
				<Icon type={IconType.HOME} size="0-5"/>
				<Icon type={IconType.HOME} size="0-75"/>
				<Icon type={IconType.HOME} size="1"/>
				<Icon type={IconType.HOME} size="1-5"/>
				<Icon type={IconType.HOME} size="2"/>
				<Icon type={IconType.HOME} size="3"/>
			</div>
		</ShowcaseSection>;
	}


	function renderElementBase() {
		return <ShowcaseSection title={"Element Base"}>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} interactive>Raised</BaseElementRaised>
				<BaseElementFlat style={{padding: "7px"}}>Flat</BaseElementFlat>
				<BaseElementInset style={{padding: "7px"}}>Inset</BaseElementInset>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} interactive disabled>Raised Disabled</BaseElementRaised>
				<BaseElementInset style={{padding: "7px"}} disabled>Inset Disabled</BaseElementInset>
			</div>
			<h4 style={{color: "var(--color-text-primary)"}}>Variants of Raised</h4>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="info" interactive>Raised
					Primary</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="info" interactive disabled>Raised Primary
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="success" interactive>Raised
					Success</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="success" interactive disabled>Raised Success
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive>Raised
					Warn</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive disabled>Raised Warn
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="error" interactive>Raised
					error</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="error" interactive disabled>Raised error
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} error interactive>Raised Error State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="info" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="success" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="warn" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementFlat style={{padding: "7px"}} error>Flat Error State</BaseElementFlat>
				<BaseElementInset style={{padding: "7px"}} error>Inset Error State</BaseElementInset>
			</div>

			<div style={{display: "flex"}}>
				<BaseElementRaised interactive groupPos="left" style={{padding: "7px"}}>Left</BaseElementRaised>
				<BaseElementRaised interactive groupPos="center" style={{padding: "7px"}}>Center</BaseElementRaised>
				<BaseElementRaised interactive groupPos="center" style={{padding: "7px"}}>Center</BaseElementRaised>
				<BaseElementRaised interactive groupPos="right" style={{padding: "7px"}}>Right</BaseElementRaised>
			</div>

		</ShowcaseSection>;
	}


	function dummyElement(width: number, height: number): ReactElement {
		return (
			<div style={{
				minWidth: width + "px",
				minHeight: height + "px",
				backgroundColor: "gray"
			}}/>
		);
	}

}
