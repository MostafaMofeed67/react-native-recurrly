import { colors } from "@/constants/theme";
import { clsx } from "clsx";
import { ActivityIndicator, Pressable, Text } from "react-native";

const AuthButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AuthButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={clsx(
        "auth-button active:opacity-85",
        isDisabled && "auth-button-disabled",
      )}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text className="auth-button-text">{title}</Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
