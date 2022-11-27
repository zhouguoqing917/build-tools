import { resolveApp } from "./utils";

export const paths = {
	appPackageJson: resolveApp("package.json"),
	tsconfigJson: resolveApp("tsconfig.json"),
	testsSetup: resolveApp("test/setupTests.ts"),
	appRoot: resolveApp("."),
	appSrc: resolveApp("src"),
	appErrorsJson: resolveApp("errors/codes.json"),
	appErrors: resolveApp("errors"),
	appDist: resolveApp("lib"),
	appSrcAssets: resolveApp("src/assets"),
	appLibAssets: resolveApp("lib/assets"),
	appConfig: resolveApp("tsdx.config.js"),
	jestConfig: resolveApp("jest.config.js"),
	postcssConfig: resolveApp("postcss.config.js"),
	progressEstimatorCache: resolveApp("node_modules/.cache/.progress-estimator"),
};
