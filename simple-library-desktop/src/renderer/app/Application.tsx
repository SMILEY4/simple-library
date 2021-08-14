import React, {Component, ReactElement} from "react";
import {ComponentShowcase} from "../components/_showcase/ComponentShowcase";
import {WelcomeView} from "./views/welcome/WelcomeView";
import {MainView} from "./views/main/MainView";
import {NotificationStateProvider} from "./store/notificationState";
import {Compose} from "../components/misc/compose/Compose";
import {CollectionsStateProvider} from "./store/collectionsState";
import {ItemSelectionStateProvider} from "./store/itemSelectionState";
import {ItemsStateProvider} from "./store/itemsState";
import {CollectionSidebarStateProvider} from "./store/collectionSidebarState";
import {CollectionActiveStateProvider} from "./store/collectionActiveState";
import {getTheme, setTheme} from "./common/messagingInterface";

export enum Theme {
	LIGHT = "light",
	DARK = "dark"
}

export enum View {
	WELCOME = "welcome",
	MAIN = "main"
}

interface AppState {
	theme: Theme,
	currentView: View,
	displayComponentShowcase: boolean
}

export const APP_ROOT_ID = "root";

export class Application extends Component<any, AppState> {

	constructor(props: any) {
		super(props);
		this.state = {
			theme: Theme.LIGHT,
			currentView: View.WELCOME,
			displayComponentShowcase: false
		};
		this.handleSetTheme = this.handleSetTheme.bind(this);
		this.renderComponentShowcase = this.renderComponentShowcase.bind(this);
		this.renderWelcomeView = this.renderWelcomeView.bind(this);
		this.renderMainView = this.renderMainView.bind(this);
		window.addEventListener("keyup", e => {
			if (e.code === "KeyD" && (e.ctrlKey || e.metaKey)) {
				this.setState({displayComponentShowcase: !this.state.displayComponentShowcase});
			}
			if (e.code === "KeyT" && (e.ctrlKey || e.metaKey)) {
				this.handleSetTheme(this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
			}
		}, true);

		getTheme()
			.then((theme: "dark" | "light") => theme === "light" ? Theme.LIGHT : Theme.DARK)
			.then((theme: Theme) => this.setState({theme: theme}));
	}

	handleSetTheme(theme: Theme) {
		setTheme(theme === Theme.DARK ? "dark" : "light").then(() => {
			this.setState({theme: theme});
		});
	}

	render(): any {
		if (this.state.displayComponentShowcase) {
			return this.renderComponentShowcase();
		} else {
			if (this.state.currentView === View.WELCOME) {
				return this.renderWithGlobalStates(this.renderWelcomeView());
			}
			if (this.state.currentView === View.MAIN) {
				return this.renderWithGlobalStates(this.renderMainView());
			}
		}
	}

	renderWithGlobalStates(element: ReactElement): ReactElement {
		return (
			<Compose components={[
				CollectionActiveStateProvider,
				CollectionSidebarStateProvider,
				CollectionsStateProvider,
				ItemSelectionStateProvider,
				ItemsStateProvider,
				NotificationStateProvider
			]}>
				{element}
			</Compose>
		);
	}


	renderComponentShowcase(): ReactElement {
		return (
			<div className="root-view" style={{width: "100%", height: "100%"}} id={APP_ROOT_ID}>
				<ComponentShowcase
					theme={this.state.theme}
					onChangeTheme={(nextTheme: Theme) => this.setState({theme: nextTheme})}
				/>
			</div>
		);
	}


	renderWelcomeView(): ReactElement {
		return (
			<div
				className={"root-view theme-" + this.state.theme}
				style={{width: "100%", height: "100%"}}
				id={APP_ROOT_ID}
			>
				<WelcomeView onLoadProject={() => {
					this.setState({currentView: View.MAIN})
				}}/>
			</div>
		);
	}


	renderMainView(): ReactElement {
		return (
			<div
				className={"root-view theme-" + this.state.theme}
				style={{width: "100%", height: "100%"}}
				id={APP_ROOT_ID}
			>
				<MainView onClosed={() => this.setState({currentView: View.WELCOME})}/>
			</div>
		);
	}

}
