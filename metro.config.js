const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativewind(getDefaultConfig(__dirname));

// NativeWind (react-native-css 3.1.0-rc.1) redirects every `react-native`
// import to its own wrapper, but that wrapper does not re-export
// `AssetRegistry` (new public API in React Native 0.88). expo-asset needs it,
// so expo-font's useFonts fails with "Cannot read property 'getAssetByID' of
// undefined". Third-party packages don't use `className`, so let imports
// coming from node_modules resolve to the real `react-native` package.
const nativewindResolveRequest = config.resolver.resolveRequest;
const nodeModules = `${path.sep}node_modules${path.sep}`;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "react-native" &&
    context.originModulePath.includes(nodeModules) &&
    !context.originModulePath.includes(`${nodeModules}react-native-css${path.sep}`)
  ) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return nativewindResolveRequest
    ? nativewindResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
