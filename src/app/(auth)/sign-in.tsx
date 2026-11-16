import { useSignIn } from "@clerk/expo";
import { BRAND } from "@/constants/brand";
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
  splitAuthError,
  validateEmail,
  validatePassword,
} from "../../../lib/auth";

type Step = "credentials" | "verify";
type ServerError = { field: AuthFormField | null; message: string } | null;

const SignIn = () => {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState<ServerError>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordRef = useRef<TextInputInstance>(null);

  const loading = submitting || fetchStatus === "fetching";

  const clientErrors = {
    email: touched.email ? validateEmail(email) : null,
    password: touched.password
      ? validatePassword(password, { strict: false })
      : null,
  };

  const fieldError = (field: AuthFormField) =>
    serverError?.field === field ? serverError.message : null;
  const formError = serverError && !serverError.field ? serverError.message : null;

  const clearServerError = (field: AuthFormField) => {
    if (serverError?.field === field || !serverError?.field) setServerError(null);
  };

  const finishSignIn = async () => {
    const { error } = await signIn.finalize({
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
    if (error)
      setServerError({ field: null, message: getAuthErrorMessage(error) ?? FALLBACK_ERROR });
  };

  const startEmailCodeCheck = async () => {
    const hasEmailCode = signIn.supportedSecondFactors?.some(
      (factor) => factor.strategy === "email_code",
    );
    if (!hasEmailCode) {
      setServerError({
        field: null,
        message:
          "This account uses a verification method that isn't available in the app yet.",
      });
      return;
    }

    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setServerError(splitAuthError(error));
      return;
    }
    setStep("verify");
  };

  const handleSignIn = async () => {
    if (loading) return;
    setTouched({ email: true, password: true });
    setServerError(null);

    if (validateEmail(email) || validatePassword(password, { strict: false })) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signIn.password({
        identifier: normalizeEmail(email),
        password,
      });
      if (error) {
        setServerError(splitAuthError(error));
        return;
      }

      switch (signIn.status) {
        case "complete":
          await finishSignIn();
          break;
        case "needs_client_trust":
        case "needs_second_factor":
          await startEmailCodeCheck();
          break;
        case "needs_new_password":
          setServerError({
            field: null,
            message: "Your password needs to be reset before you can sign in.",
          });
          break;
        default:
          setServerError({ field: null, message: FALLBACK_ERROR });
      }
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
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        const split = splitAuthError(error);
        setServerError(split && { ...split, field: split.field ?? "code" });
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
      } else {
        setServerError({ field: null, message: FALLBACK_ERROR });
      }
    } catch (error) {
      setServerError(splitAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setServerError(null);
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setServerError({ field: null, message: getAuthErrorMessage(error) ?? FALLBACK_ERROR });
      return false;
    }
    return true;
  };

  const handleStartOver = async () => {
    setServerError(null);
    setPassword("");
    setTouched({ email: false, password: false });
    await signIn.reset();
    setStep("credentials");
  };

  if (step === "verify") {
    return (
      <AuthShell
        title="Confirm it's you"
        subtitle="New device detected. Enter the code we emailed you to keep your account secure."
      >
        <CodeVerification
          email={normalizeEmail(email)}
          onVerify={handleVerify}
          onResend={handleResend}
          onBack={handleStartOver}
          backLabel="Start over"
          loading={loading}
          serverError={fieldError("code")}
          formError={formError}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">New to {BRAND.name}?</Text>
          <Link href="/(auth)/sign-up" replace className="auth-link">
            Create an account
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
          textContentType="username"
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
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSignIn}
          error={clientErrors.password ?? fieldError("password") ?? undefined}
        />

        <FormBanner message={formError} />

        <AuthButton title="Sign in" onPress={handleSignIn} loading={loading} />
      </View>
    </AuthShell>
  );
};

export default SignIn;
