import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
	preset: "ts-jest",
	setupFilesAfterEnv: ["./jest.setup.redis-mock.js", "./src/testHelper.ts"],
};

export default jestConfig;
