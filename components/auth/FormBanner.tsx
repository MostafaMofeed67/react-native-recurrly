import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

/** Inline, non-field message shown above a form's primary action. */
const FormBanner = ({ message }: { message?: string | null }) => {
  if (!message) return null;

  return (
    <View
      className="flex-row items-start gap-2 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3"
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Ionicons name="alert-circle" size={18} color={colors.destructive} />
      <Text className="flex-1 text-sm font-sans-medium text-destructive">
        {message}
      </Text>
    </View>
  );
};

export default FormBanner;
