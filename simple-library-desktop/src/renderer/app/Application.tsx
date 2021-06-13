import {hot} from 'react-hot-loader/root';
import React, {Component} from 'react';
import {ComponentShowcase} from "../components/_showcase/ComponentShowcase";
import {WelcomeView} from "./views/welcome/WelcomeView";
import {MainView} from "./views/main/MainView";
import {SetApplicationTheme} from "../../common/messaging/messagesWindow";
import {GlobalAppStateProvider} from "./store/globalAppState";

const {ipcRenderer} = window.require('electron');

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark'
}

export enum View {
	WELCOME = 'welcome',
	MAIN = 'main'
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
			displayComponentShowcase: false,
		};
		this.handleSetTheme = this.handleSetTheme.bind(this);
		this.renderComponentShowcase = this.renderComponentShowcase.bind(this);
		this.renderWelcomeView = this.renderWelcomeView.bind(this);
		this.renderMainView = this.renderMainView.bind(this);
		window.addEventListener('keyup', e => { // shift + alt + D => toggle component _showcase
			if (e.key === 'D' && e.ctrlKey && e.altKey) {
				this.setState({displayComponentShowcase: !this.state.displayComponentShowcase});
			}
		}, true);
		window.addEventListener('keyup', e => { // shift + alt + T => toggle theme
			if (e.key === 'T' && e.shiftKey && e.altKey) {
				this.handleSetTheme(this.state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
			}
		}, true);
		this.handleSetTheme(this.state.theme)
	}

	handleSetTheme(theme: Theme) {
		SetApplicationTheme.request(ipcRenderer, theme === Theme.DARK ? "dark" : "light").then(() => {
			this.setState({theme: theme});
		})
	}

	render(): any {
		if (this.state.displayComponentShowcase) {
			return this.renderComponentShowcase();
		} else {
			if (this.state.currentView === View.WELCOME) {
				return this.renderWelcomeView();
			}
			if (this.state.currentView === View.MAIN) {
				return this.renderMainView();
			}
		}
	}


	renderComponentShowcase() {
		return (
			<div className='root-view' style={{width: '100%', height: '100%'}} id={APP_ROOT_ID}>
				<ComponentShowcase
					theme={this.state.theme}
					onChangeTheme={(nextTheme: Theme) => this.setState({theme: nextTheme})}
				/>
			</div>
		);
	}


	renderWelcomeView() {
		return (
			<GlobalAppStateProvider>
				<div
					className={'root-view theme-' + this.state.theme}
					style={{width: '100%', height: '100%'}}
					id={APP_ROOT_ID}
				>
					<WelcomeView onLoadProject={() => this.setState({currentView: View.MAIN})}/>
				</div>
			</GlobalAppStateProvider>
		);
	}


	renderMainView() {
		return (
			<GlobalAppStateProvider>
				<div
					className={'root-view theme-' + this.state.theme}
					style={{width: '100%', height: '100%'}}
					id={APP_ROOT_ID}
				>
					<MainView onClosed={() => this.setState({currentView: View.WELCOME})}/>
				</div>
			</GlobalAppStateProvider>
		);
	}

}

export default hot(Application);
