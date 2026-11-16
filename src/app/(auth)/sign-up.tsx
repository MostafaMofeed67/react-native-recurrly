import { useSignUp } from "@clerk/expo";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, type TextInputInstance, View } from "react-native";

import AuthButton from "../../../components/auth/AuthButton";
import AuthField from "../../../components/auth/AuthField";
import AuthShell from "../../../components/auth/AuthShell";
import CodeVerification from "../../../components/auth/CodeVerification";
import FormBanner from "../../../components/auth/FormBanner";
import {
  type AuthFormField,
  FALLBACK_ERROR,
  getAuthErrorMessage,
  normalizeEmail,
  PASSWORD_MIN_LENGTH,
  splitAuthError,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../../../lib/auth";

type Step = "details" | "verify";
type ServerError = { field: AuthFormField | null; message: string } | null;

const SignUp = () => {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });
  const [serverError, setServerError] = useState<ServerError>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);

  const loading = submitting || fetchStatus === "fetching";

  const clientErrors = {
    email: touched.email ? validateEmail(email) : null,
    password: touched.password ? validatePassword(password) : null,
    confirm: touched.confirm
      ? validatePasswordMatch(password, confirmPassword)
      : null,
  };

  const fieldError = (field: AuthFormField) =>
    serverError?.field === field ? serverError.message : null;
  const formError = serverError && !serverError.field ? serverError.message : null;

  const clearServerError = (field: AuthFormField) => {
    if (serverError?.field === field || !serverError?.field) setServerError(null);
  };

  const finishSignUp = async () => {
    const { error } = await signUp.finalize({
      navigate: async ({ session }) => {
        if (session?.currentTask) {
          setServerError({
            field: null,
            message: "Your account needs one more step before you can continue.",
          });
          return;
        }
        router.replace("/(tabs)");
      },
    });
    if (error) setServerError({ field: null, message: getAuthErrorMessage(error) ?? FALLBACK_ERROR });
  };

  const handleCreateAccount = async () => {
    if (loading) return;
    setTouched({ email: true, password: true, confirm: true });
    setServerError(null);

    if (
      validateEmail(email) ||
      validatePassword(password) ||
      validatePasswordMatch(password, confirmPassword)
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp.password({
        emailAddress: normalizeEmail(email),
        password,
      });
      if (error) {
        setServerError(splitAuthError(error));
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setServerError(splitAuthError(sendError));
        return;
      }

      setStep("verify");
    } catch (error) {
      setServerError(splitAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (code: string) => {
    if (loading) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        const split = splitAuthError(error);
        setServerError(split && { ...split, field: split.field ?? "code" });
        return;
      }

      if (signUp.status === "complete") {
        await finishSignUp();
      } else {
        setServerError({
          field: null,
          message: "We couldn't finish creating your account. Please try again.",
        });
      }
    } catch (error) {
      setServerError(splitAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setServerError(null);
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setServerError({ field: null, message: getAuthErrorMessage(error) ?? FALLBACK_ERROR });
      return false;
    }
    return true;
  };

  if (step === "verify") {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle="Enter the code we emailed you to confirm it's really you."
      >
        <CodeVerification
          email={normalizeEmail(email)}
          onVerify={handleVerify}
          onResend={handleResend}
          onBack={() => {
            setServerError(null);
            setStep("details");
          }}
          loading={loading}
          serverError={fieldError("code")}
          formError={formError}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track every subscription in one place and never miss a renewal."
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/(auth)/sign-in" replace className="auth-link">
            Sign in
          </Link>
        </View>
      }
    >
      <View className="auth-form">
        <AuthField
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            clearServerError("email");
          }}
          onBlur={() => email && setTouched((t) => ({ ...t, email: true }))}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
          error={clientErrors.email ?? fieldError("email") ?? undefined}
        />

        <AuthField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearServerError("password");
          }}
          onBlur={() => password && setTouched((t) => ({ ...t, password: true }))}
          placeholder="Create a password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          submitBehavior="submit"
          helper={`At least ${PASSWORD_MIN_LENGTH} characters, with a letter and a number.`}
          error={clientErrors.password ?? fieldError("password") ?? undefined}
        />

        <AuthField
          ref={confirmRef}
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={() =>
            confirmPassword && setTouched((t) => ({ ...t, confirm: true }))
          }
          placeholder="Re-enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={handleCreateAccount}
          error={clientErrors.confirm ?? undefined}
        />

        <FormBanner message={formError} />

        <AuthButton
          title="Create account"
          onPress={handleCreateAccount}
          loading={loading}
        />

        <View className="flex-row items-center justify-center gap-1.5">
          <Ionicons name="lock-closed" size={12} color={colors.mutedForeground} />
          <Text className="auth-helper text-xs">
            Your data is encrypted and never shared.
          </Text>
        </View>

        {/* Web-only bot protection mount point; renders nothing on native. */}
        <View nativeID="clerk-captcha" />
      </View>
    </AuthShell>
  );
};

export default SignUp;
