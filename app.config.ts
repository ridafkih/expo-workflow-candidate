import type { ExpoConfig } from "@expo/config-types";
import { hashDependencies } from "dephash";
import { readFileSync } from "fs";
import { join } from "path";

// void 0;

const { APP_VARIANT = "development", EAS_BUILD } = process.env;

const packageJsonContents = readFileSync(
  join(__dirname, "package.json"),
  "utf-8"
);

const { version } = JSON.parse(packageJsonContents);

const getMajorMinorVersion = (version: string) =>
  version.split(".").slice(0, 2).join(".");

const getRuntimeVersion = () => {
  const majorMinorVersion = getMajorMinorVersion(version);
  const hash =
    EAS_BUILD === "true"
      ? readFileSync(join(__dirname, ".hash"), "utf-8")
      : hashDependencies().hash;

  if (APP_VARIANT === "artifact") return `artifact+${hash}`;

  return `${majorMinorVersion}+${hash}`;
};

const runtimeVersion = getRuntimeVersion();

const EXPO_CONFIG: ExpoConfig = {
  name: "MaxRewards",
  slug: "maxrewards",
  version,
  runtimeVersion,
  orientation: "portrait",
  icon: `./assets/icons/${APP_VARIANT}.png`,
  scheme: `maxrewards+${APP_VARIANT}`,
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/60925789-ef97-4256-8d24-472fd15292d6",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: `com.maxrewards.${APP_VARIANT}`,
    buildNumber: version,
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/android/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: `com.maxrewards.${APP_VARIANT}`,
  },
  owner: "maxrewards",
  extra: {
    eas: {
      projectId: "60925789-ef97-4256-8d24-472fd15292d6",
    },
  },
};

export default EXPO_CONFIG;
