export class RequestStash<T> {

	private store: any = {}

	public stash(obj: T): string {
		const key: string = RequestStash.genKey();
		this.store[key] = obj;
		return key;
	}

	public retrieve(key: string): T {
		const obj: T = this.store[key];
		delete this.store[key];
		return obj;
	}

	private static genKey(): string {
		return "" + (Date.now() + Math.random());
	}

}