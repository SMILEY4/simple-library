import ElectronStore from "electron-store";

const Store = require("electron-store");

export class ConfigDataAccess {

	private static readonly KEY_THEME: string = "theme";

	private readonly store: ElectronStore = new Store();

	public getApplicationTheme(): "light" | "dark" {
		const data: any = this.store.get(ConfigDataAccess.KEY_THEME);
		return (data ? data : "light");
	}

}