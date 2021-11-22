import React, {ReactElement, useState} from "react";
import {useAppTheme} from "./hooks/store/appStore";
import {WelcomeView} from "./views/welcome/WelcomeView";
import {AppDialogFrame} from "./views/AppDialogFrame";
import {MainView} from "./views/main/MainView";

export enum View {
	WELCOME = "welcome",
	MAIN = "main"
}

export const APP_ROOT_ID = "root";

export function Application(): React.ReactElement {

	const [view, setView] = useState(View.WELCOME);
	const theme = useAppTheme();


	switch (view) {
		case View.WELCOME:
			return renderWelcomeView();
		case View.MAIN:
			return renderMainView();
		default:
			return <div>{"Error rendering application. Unexpected view: " + view}</div>;

	}

	function renderWelcomeView(): ReactElement {
		return (
			<div
				className={"root-view theme-" + theme}
				style={{width: "100%", height: "100%"}}
				id={APP_ROOT_ID}
			>
				<WelcomeView onLoadProject={() => setView(View.MAIN)}/>
				<AppDialogFrame/>
			</div>
		);
	}

	function renderMainView(): ReactElement {
		return (
			<div
				className={"root-view theme-" + theme}
				style={{width: "100%", height: "100%"}}
				id={APP_ROOT_ID}
			>
				<MainView onClosed={() => setView(View.WELCOME)}/>
				<AppDialogFrame/>
			</div>
		);
	}

}
