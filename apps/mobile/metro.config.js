const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { resolve: metroResolve } = require("metro-resolver");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);

const reactDir = path.resolve(projectRoot, "node_modules", "react");

function resolvePackageDir(packageName) {
  for (const base of [projectRoot, workspaceRoot]) {
    try {
      return path.dirname(
        require.resolve(`${packageName}/package.json`, { paths: [base] }),
      );
    } catch {
      /* try next */
    }
  }
  return null;
}

const expoAssetDir = resolvePackageDir("expo-asset");
if (expoAssetDir) {
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "expo-asset": expoAssetDir,
  };
}

/** Monorepo: root has `react@18` (web); mobile must always use `react@19`. */
const previousResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react") {
    return {
      type: "sourceFile",
      filePath: path.join(reactDir, "index.js"),
    };
  }
  if (moduleName === "react/jsx-runtime") {
    return {
      type: "sourceFile",
      filePath: path.join(reactDir, "jsx-runtime.js"),
    };
  }
  if (moduleName === "react/jsx-dev-runtime") {
    return {
      type: "sourceFile",
      filePath: path.join(reactDir, "jsx-dev-runtime.js"),
    };
  }
  if (moduleName === "react-native") {
    return {
      type: "sourceFile",
      filePath: require.resolve("react-native", { paths: [projectRoot] }),
    };
  }

  if (previousResolveRequest) {
    return previousResolveRequest(context, moduleName, platform);
  }

  return metroResolve(
    { ...context, resolveRequest: metroResolve },
    moduleName,
    platform,
  );
};

module.exports = config;
