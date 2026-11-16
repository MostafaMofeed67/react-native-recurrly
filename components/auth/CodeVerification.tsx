import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  CODE_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  validateCode,
} from "../../lib/auth";
import AuthButton from "./AuthButton";
import AuthField from "./AuthField";
import FormBanner from "./FormBanner";

const CodeVerification = ({
  email,
  description,
  onVerify,
  onResend,
  onBack,
  backLabel = "Use a different email",
  loading,
  serverError,
  formError,
}: CodeVerificationProps) => {
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const clientError = touched ? validateCode(code) : null;
  const error = clientError ?? serverError ?? undefined;

  const submit = () => {
    setTouched(true);
    setNotice(null);
    if (validateCode(code) || loading) return;
    onVerify(code);
  };

  const resend = async () => {
    if (cooldown > 0 || loading) return;
    setNotice(null);
    const sent = await onResend();
    if (sent) {
      setCode("");
      setTouched(false);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice("A new code is on its way.");
    }
  };

  return (
    <View className="auth-form">
      <Text className="auth-helper">
        {description ?? "We sent a 6-digit code to "}
        <Text className="font-sans-bold text-primary">{email}</Text>
      </Text>

      <AuthField
        label="Verification code"
        value={code}
        onChangeText={(value) =>
          setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH))
        }
        onBlur={() => code && setTouched(true)}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
        returnKeyType="done"
        onSubmitEditing={submit}
        autoFocus
        error={error}
        helper={notice ?? undefined}
      />

      <FormBanner message={formError} />

      <AuthButton title="Verify" onPress={submit} loading={loading} />

      <Pressable
        onPress={resend}
        disabled={cooldown > 0 || loading}
        className="auth-secondary-button"
        accessibilityRole="button"
        accessibilityState={{ disabled: cooldown > 0 || loading }}
      >
        <Text className="auth-secondary-button-text">
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onBack}
        hitSlop={8}
        className="items-center"
        accessibilityRole="button"
      >
        <Text className="auth-link">{backLabel}</Text>
      </Pressable>
    </View>
  );
};

export default CodeVerification;
