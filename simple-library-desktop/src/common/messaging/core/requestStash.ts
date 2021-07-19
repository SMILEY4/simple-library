export class RequestStash<T> {

	private store: any = {}

	public stash(obj: T): string {
		const key: string = RequestStash.genKey();
		console.debug("stash handle with key = " + key)
		this.store[key] = obj;
		return key;
	}

	public retrieve(key: string): T {
		console.debug("retrieve handle with key = " + key)
		const obj: T = this.store[key];
		delete this.store[key];
		return obj;
	}

	private static genKey(): string {
		return "" + (Date.now() + Math.random());
	}

}