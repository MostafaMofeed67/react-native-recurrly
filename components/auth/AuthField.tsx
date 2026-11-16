import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { type Ref, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
} from "react-native";

export interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helper?: string;
  ref?: Ref<TextInputInstance>;
}

const AuthField = ({
  label,
  error,
  helper,
  secureTextEntry,
  ref,
  ...inputProps
}: AuthFieldProps) => {
  const [isHidden, setIsHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>

      <View className="justify-center">
        <TextInput
          ref={ref}
          className={clsx(
            "auth-input",
            error && "auth-input-error",
            isPassword && "pr-14",
          )}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={isPassword && isHidden}
          autoCorrect={false}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          {...inputProps}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={12}
            className="absolute right-4"
            accessibilityRole="button"
            accessibilityLabel={isHidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={isHidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.mutedForeground}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="auth-error" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text className="auth-helper">{helper}</Text>
      ) : null}
    </View>
  );
};

export default AuthField;
