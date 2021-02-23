export class Test {

    public static async runTest(name: string, test: () => Promise<boolean>) {
        console.log("===============================");
        console.log("RUNNING TEST: " + name);
        let result: boolean = false;
        try {
            result = await test();
        } catch (e) {
            console.log("Error in testcase: " + e);
            result = false;
        }
        if (result === false) {
            console.log("FAILED: " + name);
        } else {
            console.log("SUCCESSFUL: " + name);
        }
    }

}