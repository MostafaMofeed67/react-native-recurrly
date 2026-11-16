import { BRAND } from "@/constants/brand";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "../SafeAreaView";

const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View
              className="auth-logo-wrap"
              accessible
              accessibilityRole="header"
              accessibilityLabel={`${BRAND.name}, ${BRAND.tagline}`}
            >
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">{BRAND.initial}</Text>
              </View>
              <View>
                <Text className="auth-wordmark">{BRAND.name}</Text>
                <Text className="auth-wordmark-sub">{BRAND.tagline}</Text>
              </View>
            </View>

            <Text className="auth-title">{title}</Text>
            {subtitle ? <Text className="auth-subtitle">{subtitle}</Text> : null}
          </View>

          <View className="auth-card">{children}</View>

          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthShell;
