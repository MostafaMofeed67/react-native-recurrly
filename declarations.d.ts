// Types for static asset imports, e.g. `import logo from "@/assets/images/logo.png"`.
// No top-level imports here: this file must stay a global script so the
// wildcard `declare module` blocks apply project-wide.

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpeg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.gif" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.webp" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.svg" {
  const value: any;
  export default value;
}

declare module "*.css";
