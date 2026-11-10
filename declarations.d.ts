// Types for static image imports, e.g. `import logo from "@/assets/images/logo.png"`.
import type { ImageSourcePropType } from "react-native";

declare module "*.png" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.jpeg" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.gif" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.webp" {
  const value: ImageSourcePropType;
  export default value;
}
